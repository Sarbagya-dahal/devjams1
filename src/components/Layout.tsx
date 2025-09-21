import { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  FileSpreadsheet, 
  PieChart, 
  BarChart, 
  LogOut, 
  Sun, 
  Moon,
  FileUp,
  FileSearch
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LayoutProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Layout = ({ toggleTheme, isDarkMode }: LayoutProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="dark:bg-blue-950 bg-blue-50 border-r border-blue-200 dark:border-blue-800">
          <SidebarHeader className="flex items-center justify-center py-4">
            <h2 className="text-xl font-bold text-blue-800 dark:text-blue-100">Financial Analyzer</h2>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-blue-700 dark:text-blue-300">Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button 
                        variant={location.pathname === '/dashboard' ? "secondary" : "ghost"} 
                        className="w-full justify-start text-blue-800 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900" 
                        onClick={() => navigate('/dashboard')}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        <span>Upload Data</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button 
                        variant={location.pathname === '/reports' ? "secondary" : "ghost"} 
                        className="w-full justify-start text-blue-800 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900" 
                        onClick={() => navigate('/reports')}
                      >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        <span>Financial Reports</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button 
                        variant={location.pathname === '/view-reports' ? "secondary" : "ghost"} 
                        className="w-full justify-start text-blue-800 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900" 
                        onClick={() => navigate('/view-reports')}
                      >
                        <BarChart className="mr-2 h-4 w-4" />
                        <span>View Reports</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button 
                        variant={location.pathname === '/ratios' ? "secondary" : "ghost"} 
                        className="w-full justify-start text-blue-800 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900" 
                        onClick={() => navigate('/ratios')}
                      >
                        <PieChart className="mr-2 h-4 w-4" />
                        <span>Key Ratios</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-blue-700 dark:text-blue-300">Data Tools</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button 
                        variant={location.pathname === '/data-cleanup' ? "secondary" : "ghost"} 
                        className="w-full justify-start text-blue-800 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900" 
                        onClick={() => navigate('/data-cleanup')}
                      >
                        <FileSearch className="mr-2 h-4 w-4" />
                        <span>Data Cleanup</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button 
                        variant={location.pathname === '/sample-data' ? "secondary" : "ghost"} 
                        className="w-full justify-start text-blue-800 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900" 
                        onClick={() => navigate('/sample-data')}
                      >
                        <FileUp className="mr-2 h-4 w-4" />
                        <span>Sample Data</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4 space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-blue-800 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900" 
              onClick={toggleTheme}
            >
              {isDarkMode ? 
                <><Sun className="mr-2 h-4 w-4" /><span>Light Mode</span></> : 
                <><Moon className="mr-2 h-4 w-4" /><span>Dark Mode</span></>
              }
            </Button>
            <Button 
              variant="destructive" 
              className="w-full justify-start" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 p-6 overflow-auto">
          <SidebarTrigger />
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;