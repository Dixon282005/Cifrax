import { Combination } from "@/features/combinations/types";

export interface UserData {
  email: string;
  combinationsCount: number;
  lastActive: string | null;  
  firstActive: string | null; 
}

export interface AdminStats {
  totalUsers: number;
  totalCombinations: number;
  recentActivity: UserData[];
  chartData: { name: string; total: number }[];
  userList: UserData[];
}

export interface AdminCombination extends Combination {
  userEmail: string;
}


export const getLocalAdminData = (): AdminStats => {
  if (typeof window === 'undefined') {
    return { 
      totalUsers: 0, 
      totalCombinations: 0, 
      recentActivity: [], 
      chartData: [], 
      userList: [] 
    };
  }

  const usersMap = new Map<string, UserData>();
  let allCombinations: Combination[] = [];


  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    
    if (key && key.startsWith('cifrax_combinations_')) {
      const email = key.replace('cifrax_combinations_', '');
      
      try {
        const rawData = localStorage.getItem(key);
        const userCombinations: Combination[] = rawData ? JSON.parse(rawData) : [];
        
        const timestamps = userCombinations.map(c => new Date(c.createdAt).getTime());
        
        usersMap.set(email, {
          email: email,
          combinationsCount: userCombinations.length,

          lastActive: timestamps.length > 0 
            ? new Date(Math.max(...timestamps)).toISOString() 
            : null,

          firstActive: timestamps.length > 0 
            ? new Date(Math.min(...timestamps)).toISOString() 
            : null
        });

        allCombinations = [...allCombinations, ...userCombinations];
      } catch (e) {
        console.error("Error leyendo datos de usuario:", email);
      }
    }
  }

  const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  const chartDataMap = new Array(7).fill(0);
  
  allCombinations.forEach(c => {
    const date = new Date(c.createdAt);
    if (!isNaN(date.getTime())) {
        const dayIndex = date.getDay();
        chartDataMap[dayIndex]++;
    }
  });

  const chartData = days.map((day, index) => ({
    name: day,
    total: chartDataMap[index]
  }));

  const userList = Array.from(usersMap.values());

  const recentActivity = [...userList]
    .sort((a, b) => {
        const dateA = a.lastActive ? new Date(a.lastActive).getTime() : 0;
        const dateB = b.lastActive ? new Date(b.lastActive).getTime() : 0;
        return dateB - dateA;
    })
    .slice(0, 5);

  return {
    totalUsers: usersMap.size,
    totalCombinations: allCombinations.length,
    recentActivity,
    chartData,
    userList
  };
};

export const getAllGlobalCombinations = (): AdminCombination[] => {
  if (typeof window === 'undefined') return [];
  
  let rawCombinations: any[] = [];
  const groupsMap = new Map<string, string>();

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    
    if (!key) continue;

    if (key.startsWith('cifrax_groups_')) {
      try {
        const rawGroups = localStorage.getItem(key);
        const groups = rawGroups ? JSON.parse(rawGroups) : [];
        groups.forEach((g: any) => {
          groupsMap.set(g.id, g.name); 
        });
      } catch (e) { console.error("Error leyendo grupos", key); }
    }

    if (key.startsWith('cifrax_combinations_')) {
      const email = key.replace('cifrax_combinations_', '');
      try {
        const raw = localStorage.getItem(key);
        const userCombinations = raw ? JSON.parse(raw) : [];
        
        const combinationsWithOwner = userCombinations.map((c: any) => ({
          ...c,
          userEmail: email
        }));
        
        rawCombinations = [...rawCombinations, ...combinationsWithOwner];
      } catch (e) {
        console.error("Error parsing combinations for", email);
      }
    }
  }

  const finalList = rawCombinations.map(combination => {
    const groupName = combination.group 
      ? groupsMap.get(combination.group) || combination.group 
      : undefined;

    return {
      ...combination,
      group: groupName
    };
  });

  return finalList.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const deleteLocalUser = (email: string): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.removeItem(`cifrax_combinations_${email}`);
    localStorage.removeItem(`cifrax_groups_${email}`);
    localStorage.removeItem(`cifrax_user`);
    
    return true;
  } catch (e) {
    console.error("Error eliminando usuario:", e);
    return false;
  }
};

export const deleteCombinationAsAdmin = (userEmail: string, combinationId: string): boolean => {
  try {
    const key = `cifrax_combinations_${userEmail}`;
    const raw = localStorage.getItem(key);
    if (!raw) return false;

    const combinations = JSON.parse(raw);
    const newCombinations = combinations.filter((c: any) => c.id !== combinationId);
    
    localStorage.setItem(key, JSON.stringify(newCombinations));
    return true;
  } catch (e) {
    return false;
  }
};