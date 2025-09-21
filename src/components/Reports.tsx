import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { generateReports } from '@/utils/reportGenerator';
import ProfitLossStatement from './reports/ProfitLossStatement';
import BalanceSheet from './reports/BalanceSheet';
import { FileText, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FinancialEntry {
  Particulars: string;
  Debit: number | string;
  Credit: number | string;
}

const Reports = () => {
  const [trialBalanceData, setTrialBalanceData] = useState<FinancialEntry[]>([]);
  const [profitLoss, setProfitLoss] = useState<{ 
    incomes: any[], 
    expenses: any[], 
    netProfit: number,
    totalIncome: number,
    totalExpenses: number
  }>({ 
    incomes: [], 
    expenses: [], 
    netProfit: 0,
    totalIncome: 0,
    totalExpenses: 0
  });
  const [balanceSheet, setBalanceSheet] = useState<{ 
    assets: any[], 
    liabilities: any[], 
    totalAssets: number, 
    totalLiabilities: number 
  }>({ 
    assets: [], 
    liabilities: [], 
    totalAssets: 0, 
    totalLiabilities: 0 
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('financialData');
    
    if (!data) {
      toast({
        title: "No Data Found",
        description: "Please upload a trial balance file first.",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }
    
    try {
      const parsedData = JSON.parse(data);
      console.log('Retrieved data from localStorage:', parsedData);
      setTrialBalanceData(parsedData);
      
      // Use the utility function to generate reports
      const { profitLoss: plData, balanceSheet: bsData } = generateReports(parsedData);
      setProfitLoss(plData);
      setBalanceSheet(bsData);
      
      // Simulate loading for a smoother experience
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error parsing data:', error);
      toast({
        title: "Error",
        description: "Error processing the data. Please upload a valid file.",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Generating Reports...</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait while we process your financial data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-8 px-4">
      {/* Removed the conflicting `opacity-0` utility so the fade-in animation works as intended */}
      <div className="container mx-auto max-w-5xl transition-all duration-500 ease-in-out animate-fade-in">
        <div className="flex items-center justify-center mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg mr-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Financial Reports
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-md border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${profitLoss.totalIncome.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${profitLoss.totalExpenses.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${profitLoss.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                ${profitLoss.netProfit.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden transition-all duration-500 ease-in-out">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardTitle className="flex items-center text-blue-800 dark:text-blue-100">
              <BarChart3 className="mr-2 h-5 w-5" />
              Report Viewer
            </CardTitle>
            <CardDescription>
              Analyze your financial performance through detailed reports
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="profit-loss" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-blue-100 dark:bg-blue-900/30 p-1 rounded-lg">
                <TabsTrigger 
                  value="profit-loss" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-800 dark:data-[state=active]:bg-blue-800 dark:data-[state=active]:text-white transition-all duration-300 rounded-md"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Profit & Loss
                </TabsTrigger>
                <TabsTrigger 
                  value="balance-sheet" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-800 dark:data-[state=active]:bg-blue-800 dark:data-[state=active]:text-white transition-all duration-300 rounded-md"
                >
                  <PieChart className="mr-2 h-4 w-4" />
                  Balance Sheet
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profit-loss" className="animate-fade-in">
                <ProfitLossStatement data={profitLoss} />
              </TabsContent>
              
              <TabsContent value="balance-sheet" className="animate-fade-in">
                <BalanceSheet data={balanceSheet} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
