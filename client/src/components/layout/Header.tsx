import { useLocation } from "wouter";

interface HeaderProps {
  onSidebarToggle: () => void;
}

const pageHeaders = {
  "/": "Material Processing Dashboard",
  "/history": "Processing History",
  "/ai-settings": "AI Settings",
  "/catalog": "Material Catalog",
  "/classification": "Classification Guide",
  "/account": "Account Settings",
};

export function Header({ onSidebarToggle }: HeaderProps) {
  const [location] = useLocation();
  const pageTitle = pageHeaders[location as keyof typeof pageHeaders] || "Material Processing Dashboard";

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between">
      <button 
        className="md:hidden text-gray-900"
        onClick={onSidebarToggle}
      >
        <i className="ri-menu-line text-xl"></i>
      </button>
      
      <div className="hidden md:block">
        <h2 className="text-lg font-medium text-gray-900">{pageTitle}</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-900">
          <i className="ri-notification-3-line text-xl"></i>
        </button>
        <button className="text-gray-500 hover:text-gray-900">
          <i className="ri-question-line text-xl"></i>
        </button>
      </div>
    </header>
  );
}
