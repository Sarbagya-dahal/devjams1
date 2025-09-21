import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Moon, Sun, Eye, EyeOff, TrendingUp, Zap, Building2, ChartColumnIncreasing, Lock, Calculator, ArrowUp, ArrowDown, Shield, ArrowRight, BadgeCheck, DollarSign } from 'lucide-react';

interface LoginProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Login = ({ toggleTheme, isDarkMode }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Show loading screen for 2 seconds
    const loadingTimer = setTimeout(() => {
      setIsLoadingScreen(false);
      setIsVisible(true);
    }, 2000);

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => {
      clearTimeout(loadingTimer);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    if (isLoadingScreen) return;
    
    // Setup canvas animation after loading screen
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Financial data points for animation - fewer points to reduce overlap
    const dataPoints = Array.from({ length: 25 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      value: (Math.random() * 10000).toFixed(2),
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 0.5,
      isPositive: Math.random() > 0.5,
      opacity: Math.random() * 0.5 + 0.3
    }));
    
    // Animated line chart data
    const lineData = Array.from({ length: 50 }, (_, i) => ({
      x: (i / 49) * canvas.width,
      y: canvas.height / 2 + Math.sin(i / 5) * 50
    }));
    
    let animationFrameId: number;
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid with a more subtle appearance
      ctx.strokeStyle = isDarkMode ? 'rgba(100, 100, 150, 0.08)' : 'rgba(200, 200, 230, 0.2)';
      ctx.lineWidth = 1;
      
      const gridSize = 50;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw animated line chart with a more professional color
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isDarkMode ? 'rgba(59, 130, 246, 0.4)' : 'rgba(37, 99, 235, 0.5)';
      
      for (let i = 0; i < lineData.length - 1; i++) {
        ctx.moveTo(lineData[i].x, lineData[i].y);
        ctx.lineTo(lineData[i + 1].x, lineData[i + 1].y);
        
        // Move points for animation
        lineData[i].y += Math.sin(Date.now() / 1000 + i) * 0.3;
      }
      ctx.stroke();
      
      // Update and draw data points - only in areas that won't overlap with content
      dataPoints.forEach(point => {
        // Move point
        point.x -= point.speed;
        if (point.x < -50) {
          point.x = canvas.width + 50;
          point.y = Math.random() * (canvas.height - 300) + 150; // Avoid top and bottom areas
        }
        
        // Only draw if not overlapping with main content areas
        const isInContentArea = 
          (point.x > canvas.width * 0.25 && point.x < canvas.width * 0.75 && 
           point.y > canvas.height * 0.3 && point.y < canvas.height * 0.7);
        
        if (!isInContentArea) {
          // Draw value
          ctx.font = '10px monospace';
          ctx.fillStyle = point.isPositive 
            ? (isDarkMode ? 'rgba(74, 222, 128, 0.7)' : 'rgba(34, 197, 94, 0.8)') 
            : (isDarkMode ? 'rgba(248, 113, 113, 0.7)' : 'rgba(239, 68, 68, 0.8)');
          ctx.fillText(`$${point.value}`, point.x, point.y);
          
          // Draw indicator
          ctx.fillStyle = point.isPositive 
            ? (isDarkMode ? 'rgba(74, 222, 128, 0.3)' : 'rgba(34, 197, 94, 0.3)') 
            : (isDarkMode ? 'rgba(248, 113, 113, 0.3)' : 'rgba(239, 68, 68, 0.3)');
          ctx.beginPath();
          ctx.arc(point.x - 15, point.y - 5, point.size * 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw arrow
          ctx.fillStyle = point.isPositive 
            ? (isDarkMode ? 'rgba(74, 222, 128, 0.9)' : 'rgba(34, 197, 94, 0.9)') 
            : (isDarkMode ? 'rgba(248, 113, 113, 0.9)' : 'rgba(239, 68, 68, 0.9)');
          
          if (point.isPositive) {
            // Up arrow
            ctx.beginPath();
            ctx.moveTo(point.x - 20, point.y);
            ctx.lineTo(point.x - 15, point.y - 5);
            ctx.lineTo(point.x - 10, point.y);
            ctx.fill();
          } else {
            // Down arrow
            ctx.beginPath();
            ctx.moveTo(point.x - 20, point.y - 5);
            ctx.lineTo(point.x - 15, point.y);
            ctx.lineTo(point.x - 10, point.y - 5);
            ctx.fill();
          }
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isDarkMode, isLoadingScreen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        toast({
          title: "Login Successful",
          description: "Welcome to Financial Report Analyzer",
        });
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password. Try using admin/admin",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const createRipple = (e: React.MouseEvent) => {
    const button = e.currentTarget as HTMLElement;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  };

  // Loading screen component
  if (isLoadingScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="relative w-72 h-56 mb-12">
          {/* Stock chart animation */}
          <div className="absolute inset-0 bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="h-full w-full relative">
              {/* Grid lines */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="absolute w-full h-px bg-gray-500" style={{ top: `${i * 25}%` }}></div>
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="absolute h-full w-px bg-gray-500" style={{ left: `${i * 25}%` }}></div>
                ))}
              </div>
              
              {/* Animated stock line */}
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path 
                  d="M0,80 C20,60 40,20 60,40 C80,60 100,20 100,20" 
                  stroke="url(#stockGradient)" 
                  strokeWidth="3" 
                  fill="none" 
                  className="animate-drawLine"
                />
                <defs>
                  <linearGradient id="stockGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4ADE80" />
                    <stop offset="100%" stopColor="#22C55E" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Rising green indicator */}
              <div className="absolute bottom-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-tl-lg flex items-center">
                <ArrowUp size={12} className="mr-1" />
                <span>+2.5%</span>
              </div>
            </div>
          </div>
          
          {/* Logo */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-gray-900 py-3 px-5 rounded-lg shadow-lg border border-gray-700">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">
              <span className="text-blue-400">Fin</span>Analyst
            </h1>
          </div>
        </div>
        
        {/* Progress bar - larger size */}
        <div className="w-96 bg-gray-800 rounded-full h-3 mb-6 border border-gray-700">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-100 ease-linear relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            {/* Dollar signs in progress bar */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute text-white opacity-80"
                style={{
                  left: `${i * 12}%`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  animation: `moveDollars 1.5s linear infinite`,
                  animationDelay: `${i * 0.2}s`
                }}
              >
                <DollarSign size={14} />
              </div>
            ))}
          </div>
        </div>
        
        <p className="text-gray-400 text-lg">Loading financial intelligence...</p>
        
        <style>{`
          @keyframes drawLine {
            0% {
              stroke-dasharray: 1000;
              stroke-dashoffset: 1000;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
          .animate-drawLine {
            animation: drawLine 2s ease-in-out forwards;
          }
          @keyframes moveDollars {
            0% {
              transform: translateX(0) translateY(-50%);
              opacity: 0.8;
            }
            100% {
              transform: translateX(300px) translateY(-50%);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen flex bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'} relative overflow-hidden`}
    >
      {/* Animated canvas background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
        style={{ 
          background: isDarkMode 
            ? 'radial-gradient(circle at 30% 30%, rgba(30, 64, 175, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(30, 64, 175, 0.1) 0%, transparent 50%)' 
            : 'radial-gradient(circle at 30% 30%, rgba(200, 220, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(200, 220, 255, 0.2) 0%, transparent 50%)'
        }}
      />
      
      {/* Moving financial indicators - reduced number and positioned to avoid content */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-xs font-mono font-bold text-blue-600 dark:text-blue-400 opacity-70 animate-float"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDuration: `${Math.random() * 15 + 15}s`,
              animationDelay: `${i * 2}s`,
              zIndex: 1
            }}
          >
            {Math.random() > 0.5 ? (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <ArrowUp size={12} className="mr-1" />
                <span>+{(Math.random() * 5).toFixed(2)}%</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600 dark:text-red-400">
                <ArrowDown size={12} className="mr-1" />
                <span>-{(Math.random() * 3).toFixed(2)}%</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Theme toggle button */}
      <div className="absolute top-6 right-6 z-20">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-full h-12 w-12 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-md hover:scale-105 transition-transform border border-gray-300 dark:border-gray-600"
        >
          {isDarkMode ? <Sun className="h-6 w-6 text-blue-600" /> : <Moon className="h-6 w-6 text-blue-600" />}
        </Button>
      </div>

      {/* Header section */}
      <div className="absolute top-8 left-8 z-20">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            <span className="text-blue-600">Fin</span>Analyst
          </h1>
        </div>
      </div>

      {/* Main content - split screen layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-center p-6 md:p-10 z-10">
        {/* Left side - promotional content */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 p-8 text-left">
          <div className="space-y-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl shadow-lg z-20">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
              AI-Powered Financial <span className="text-blue-600">Intelligence</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md">
              Real-time analytics, predictive insights, and intelligent reporting for modern financial professionals.
            </p>
            
            <div className="mt-6 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 p-4 rounded-lg w-32">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                99%
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-200 mt-1">Accuracy</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 mt-6 z-20">
            <div className="flex items-start space-x-4 p-4 rounded-xl backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white/90 dark:hover:bg-gray-800/90 cursor-pointer border border-blue-100 dark:border-blue-800/30">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                <ChartColumnIncreasing className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Real-time Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Live market data and trends</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 rounded-xl backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white/90 dark:hover:bg-gray-800/90 cursor-pointer border border-blue-100 dark:border-blue-800/30">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Bank-Level Security</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enterprise-grade security protocols</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 rounded-xl backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white/90 dark:hover:bg-gray-800/90 cursor-pointer border border-blue-100 dark:border-blue-800/30">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Business Intelligence</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive financial reporting</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - login card */}
        <div className="flex items-center justify-center z-20">
          <Card 
            className="w-full max-w-md shadow-xl bg-gradient-to-b from-white to-gray-100 dark:from-gray-700 dark:to-gray-800 backdrop-blur-md border border-gray-300 dark:border-gray-600 overflow-hidden transition-all duration-1000 ease-out"
            style={{ 
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
              opacity: isVisible ? 1 : 0
            }}
          >
            {/* Accent bar */}
            <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-700"></div>
            
            <CardHeader className="space-y-1 pb-4 pt-8">
              <div className="flex justify-center items-center mb-2">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 shadow-md mr-3">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  <span className="text-blue-600">Fin</span>Analyst
                </h2>
              </div>
              <CardTitle className="text-xl text-center font-bold text-gray-800 dark:text-white">
                Secure Login
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-300">
                Access your financial dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent className="grid gap-5 pb-6">
              <form onSubmit={handleLogin}>
                <div className="grid gap-5">
                  <div className="grid gap-2">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Username
                    </label>
                    <div className="relative">
                      <Input
                        id="username"
                        placeholder="Enter your username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoComplete="off"
                        className="py-5 pl-10 pr-4 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600/50 dark:text-white"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="py-5 pl-10 pr-12 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600/50 dark:text-white"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-blue-500 hover:text-blue-700 transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-blue-500 hover:text-blue-700 transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full py-5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg hover:shadow-blue-500/30 text-white font-semibold relative overflow-hidden group"
                    disabled={isLoading}
                    onClick={createRipple}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Lock className="mr-2 h-5 w-5" />
                        Sign In
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>

              {/* Security trust signals */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Shield className="h-4 w-4 text-green-500 mr-1" />
                    <span>Bank-level encryption</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <BadgeCheck className="h-4 w-4 text-blue-500 mr-1" />
                    <span>ISO 27001 certified</span>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center py-5 bg-gray-50 dark:bg-gray-700/30">
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                Use <span className="font-semibold text-blue-600 dark:text-blue-400">admin</span> / 
                <span className="font-semibold text-blue-600 dark:text-blue-400">admin</span> to sign in
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-500 dark:text-gray-400 z-20">
        <p>© {new Date().getFullYear()} FinAnalyst. All rights reserved.</p>
      </div>

      {/* Add custom styles for animations */}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .ripple {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.7);
          transform: scale(0);
          animation: ripple 0.6s linear;
        }
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;