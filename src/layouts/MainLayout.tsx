import React from 'react';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showHeader = true,
  className = "" 
}) => {
  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 ${className}`}>
      {showHeader && <Header />}
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
