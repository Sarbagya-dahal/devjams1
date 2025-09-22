import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const SampleDataGenerator = () => {
  const [generating, setGenerating] = useState(false);
  const [format, setFormat] = useState<'xlsx' | 'csv'>('xlsx');
  const [rowCount, setRowCount] = useState(50);
  const [includeAssets, setIncludeAssets] = useState(true);
  const [includeLiabilities, setIncludeLiabilities] = useState(true);
  const [includeEquity, setIncludeEquity] = useState(true);
  const [includeIncome, setIncludeIncome] = useState(true);
  const [includeExpenses, setIncludeExpenses] = useState(true);
  const { toast } = useToast();

  // Define accounts by category
  const accountCategories = {
    assets: [
      'Cash in Hand', 'Cash at Bank', 'Accounts Receivable', 'Inventory', 'Equipment',
      'Furniture and Fixtures', 'Computer Equipment', 'Prepaid Rent', 'Prepaid Insurance',
      'Investments', 'Land', 'Buildings', 'Vehicles', 'Office Supplies'
    ],
    liabilities: [
      'Accounts Payable', 'Bank Loan', 'Bank Overdraft', 'Credit Card Payable',
      'Sundry Creditors', 'Notes Payable', 'Interest Payable', 'Salary Payable',
      'Taxes Payable', 'Unearned Revenue', 'Mortgage Payable'
    ],
    equity: [
      'Common Stock', 'Retained Earnings', "Owner's Drawing", 'Additional Paid-in Capital'
    ],
    income: [
      'Sales Revenue', 'Service Revenue', 'Interest Income', 'Rental Income',
      'Commission Income', 'Discount Received', 'Miscellaneous Income', 'Royalty Income'
    ],
    expenses: [
      'Purchases', 'Salaries Expense', 'Rent Expense', 'Utilities Expense',
      'Insurance Expense', 'Depreciation Expense', 'Advertising Expense',
      'Office Supplies Expense', 'Telephone Expense', 'Internet Expense',
      'Repair and Maintenance', 'Fuel Expense', 'Legal Fees', 'Accounting Fees',
      'Bank Charges', 'Interest Expense', 'Bad Debts', 'Staff Training',
      'Travel Expense', 'Entertainment Expense', 'Printing and Stationery'
    ]
  };

  const generateRandomAmount = (min = 1000, max = 50000) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getRandomAccount = () => {
    const selectedCategories = [];
    if (includeAssets) selectedCategories.push(...accountCategories.assets);
    if (includeLiabilities) selectedCategories.push(...accountCategories.liabilities);
    if (includeEquity) selectedCategories.push(...accountCategories.equity);
    if (includeIncome) selectedCategories.push(...accountCategories.income);
    if (includeExpenses) selectedCategories.push(...accountCategories.expenses);
    
    if (selectedCategories.length === 0) {
      return 'Cash in Hand'; // Default fallback
    }
    
    return selectedCategories[Math.floor(Math.random() * selectedCategories.length)];
  };

  const isDebitAccount = (accountName) => {
    // Assets and expenses typically have debit balances
    if (accountCategories.assets.includes(accountName) || accountCategories.expenses.includes(accountName)) {
      return true;
    }
    // Liabilities, equity, and income typically have credit balances
    return false;
  };

  const generateSampleData = () => {
    setGenerating(true);
    try {
      // Create data with just the headers and account rows
      const sampleData = [
        ['Particulars', 'Debit', 'Credit']
      ];
      
      const generatedAccounts = new Set();
      
      // Generate random data rows
      for (let i = 0; i < rowCount; i++) {
        let account = getRandomAccount();
        
        // Ensure we don't repeat the same account too many times
        let attempts = 0;
        while (generatedAccounts.has(account) && attempts < 10) {
          account = getRandomAccount();
          attempts++;
        }
        
        generatedAccounts.add(account);
        
        const amount = generateRandomAmount();
        
        if (isDebitAccount(account)) {
          sampleData.push([account, amount.toString(), '']);
        } else {
          sampleData.push([account, '', amount.toString()]);
        }
      }

      // Create a workbook
      const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Trial Balance');

      let fileName = '';

      if (format === 'xlsx') {
        // Generate Excel file
        fileName = 'sample_trial_balance.xlsx';
        XLSX.writeFile(workbook, fileName);
      } else {
        // Generate CSV file
        const csvContent = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        
        // Create download link
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        fileName = 'sample_trial_balance.csv';
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast({
        title: "Sample Data Generated",
        description: `A sample trial balance ${format.toUpperCase()} file with ${rowCount} rows has been downloaded.`,
      });
    } catch (error) {
      console.error('Error generating sample data:', error);
      toast({
        title: "Error",
        description: "Failed to generate sample data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Sample Data Generator</h1>
      
      <Card className="shadow-lg dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileSpreadsheet className="mr-2 h-5 w-5" />
            Sample Data Generator
          </CardTitle>
          <CardDescription>
            Generate a randomized sample file with financial data that matches the expected format.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Number of rows: {rowCount}</h3>
            <Slider
              defaultValue={[rowCount]}
              max={100}
              min={10}
              step={1}
              onValueChange={(values) => setRowCount(values[0])}
              className="mb-4"
            />
            <p className="text-xs text-muted-foreground">
              Choose between 10 and 100 rows of random financial data
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Include Account Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="assets"
                  checked={includeAssets}
                  onCheckedChange={setIncludeAssets}
                />
                <Label htmlFor="assets">Assets</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="liabilities"
                  checked={includeLiabilities}
                  onCheckedChange={setIncludeLiabilities}
                />
                <Label htmlFor="liabilities">Liabilities</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="equity"
                  checked={includeEquity}
                  onCheckedChange={setIncludeEquity}
                />
                <Label htmlFor="equity">Equity</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="income"
                  checked={includeIncome}
                  onCheckedChange={setIncludeIncome}
                />
                <Label htmlFor="income">Income</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="expenses"
                  checked={includeExpenses}
                  onCheckedChange={setIncludeExpenses}
                />
                <Label htmlFor="expenses">Expenses</Label>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="xlsx" onValueChange={(value) => setFormat(value as 'xlsx' | 'csv')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="xlsx">Excel (.xlsx)</TabsTrigger>
              <TabsTrigger value="csv">CSV</TabsTrigger>
            </TabsList>
            <TabsContent value="xlsx">
              <p className="text-sm text-muted-foreground">
                Generate an Excel file that can be imported into the application. This format preserves all data types.
              </p>
            </TabsContent>
            <TabsContent value="csv">
              <p className="text-sm text-muted-foreground">
                Generate a CSV file that can be imported into the application. This is a plain text format compatible with most spreadsheet applications.
              </p>
            </TabsContent>
          </Tabs>
          
          <div>
            <p className="text-sm text-muted-foreground">
              This will create a sample trial balance with randomly generated values for various accounts.
              The generated file will be immediately downloaded to your device.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={generateSampleData} 
            disabled={generating || (!includeAssets && !includeLiabilities && !includeEquity && !includeIncome && !includeExpenses)}
            className="ml-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            {generating ? "Generating..." : "Generate Sample Data"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SampleDataGenerator;