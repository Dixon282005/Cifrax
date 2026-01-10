import { Lock } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'size-5',
    md: 'size-6 sm:size-8',
    lg: 'size-8 sm:size-10'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Lock className={`${sizeClasses[size]} text-cyan-400`} />
      {showText && (
        <span className={`text-white ${textSizeClasses[size]}`}>Cifrax</span>
      )}
    </div>
  );
}
