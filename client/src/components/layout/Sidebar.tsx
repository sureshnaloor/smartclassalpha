import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarLink {
  path: string;
  label: string;
  icon: string;
}

const links: SidebarLink[] = [
  { path: "/", label: "Dashboard", icon: "ri-dashboard-line" },
  { path: "/history", label: "Processing History", icon: "ri-history-line" },
  { path: "/standardization", label: "Material Standardization", icon: "ri-file-list-3-line" },
  { path: "/ai-settings", label: "AI Settings", icon: "ri-settings-4-line" },
  { path: "/catalog", label: "Material Catalog", icon: "ri-folder-chart-line" },
  { path: "/classification", label: "Classification Guide", icon: "ri-book-2-line" },
  { path: "/account", label: "Account", icon: "ri-user-settings-line" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center">
          <i className="ri-database-2-line mr-2 text-primary"></i>
          ERP Material Pro
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          {links.map((link) => (
            <li key={link.path}>
              <Link href={link.path}>
                <a 
                  className={cn(
                    "flex items-center px-4 py-3 hover:bg-gray-50",
                    location === link.path 
                      ? "bg-blue-50 text-primary border-l-4 border-primary" 
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  <i className={`${link.icon} mr-3`}></i>
                  {link.label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
            <span>JD</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500">Material Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
