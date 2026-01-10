/**
 * Exports centralizados de todos los features
 * Facilita los imports en toda la aplicación
 */

// Auth Feature
export { AuthForm } from './auth/AuthForm';

// Landing Feature
export { Landing } from './landing/Landing';

// Dashboard Feature
export { Dashboard } from './dashboard/Dashboard';

// Combinations Feature
export { CombinationForm } from './combinations/components/CombinationForm';
export { CombinationCard } from './combinations/components/CombinationCard';
export { CombinationsList } from './combinations/components/CombinationsList';
export { CombinationFilters } from './combinations/components/CombinationFilters';
export { useCombinations } from './combinations/hooks/useCombinations';
export type { Combination, SortBy } from './combinations/types';

// Groups Feature
export { GroupForm } from './groups/components/GroupForm';
export { GroupList } from './groups/components/GroupList';
export { useGroups } from './groups/hooks/useGroups';
export type { Group } from './groups/types';
export { GROUP_COLORS } from './groups/types';
