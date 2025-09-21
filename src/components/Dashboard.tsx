import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, CheckCircle, Info, TrendingUp, Upload, FileText, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FileUploader from './dashboard/FileUploader';
import FormatExample from './dashboard/FormatExample';
import { parseFinancialFile, FileAuditResult, FileParsingIssue } from '@/utils/fileParser';

const Dashboard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<FileAuditResult | null>(null);
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Show loading screen for 3 seconds
    const loadingTimer = setTimeout(() => {
      setIsLoadingScreen(false);
    }, 3000);

    return () => {
      clearTimeout(loadingTimer);
    };
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setValidationError(null);
    setAuditResult(null);
  };

  const handleError = (error: any) => {
    console.error('Error processing file:', error);
    setIsUploading(false);
    setValidationError(error.message || 'There was an issue processing your file. Please check the format and try again.');
    toast({
      title: "Error Processing File",
      description: error.message || "There was an issue processing your file. Please check the format and try again.",
      variant: "destructive",
    });
  };

  const parseFile = () => {
    if (!file) return;
    
    setIsUploading(true);
    setValidationError(null);
    setAuditResult(null);
    
    parseFinancialFile(
      file,
      (data, audit) => {
        try {
          if (audit) {
            setAuditResult(audit);
            
            if (audit.issues.length > 0 && audit.validRows > 0) {
              toast({
                title: "File Processed with Warnings",
                description: `Processed ${audit.validRows} valid rows out of ${audit.totalRows} total rows.`,
                variant: "default",
              });
            }
          }
          
          if (data.length === 0) {
            const errorMessage = 'The file does not contain any valid financial data. Please check the format.';
            setValidationError(errorMessage);
            toast({
              title: "No Valid Data",
              description: errorMessage,
              variant: "destructive",
            });
            setIsUploading(false);
            return;
          }
          
          localStorage.setItem('financialData', JSON.stringify(data));
          
          setIsUploading(false);
          toast({
            title: "Upload Successful",
            description: `Successfully processed ${data.length} entries. You can now generate reports.`,
          });
          
          navigate('/reports');
        } catch (error) {
          console.error('Data processing error:', error);
          handleError(error);
        }
      },
      handleError
    );
  };

  const renderIssueIcon = (issue: FileParsingIssue) => {
    if (issue.issue.includes('error') || issue.issue.includes('failed') || issue.issue.includes('missing required')) {
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  // Loading screen component with improved design
  if (isLoadingScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="flex flex-col items-center p-8 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-8">
            <div className="p-4 rounded-2xl bg-gray-200 dark:bg-gray-700 shadow-lg mr-4">
              <TrendingUp className="h-10 w-10 text-gray-700 dark:text-gray-300" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              <span className="text-blue-600 dark:text-blue-400">Fin</span>Analyst
            </h1>
          </div>
          
          <div className="flex space-x-3 mb-8">
            <div className="h-4 w-4 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="h-4 w-4 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-4 w-4 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Preparing your financial dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header with improved styling */}
        <div className="flex items-center justify-center mb-10">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg mr-4">
            <TrendingUp className="h-10 w-10 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              <span className="text-blue-600 dark:text-blue-400">Fin</span>Analyst Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Upload your trial balance to generate financial reports and analyze key ratios
            </p>
          </div>
        </div>
        
        {/* Stats cards at the top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 mr-4">
                <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Upload Files</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">CSV, XLSX, ODS</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 mr-4">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Required Format</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">3 Columns</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 mr-4">
                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reports Generated</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">10+ Types</p>
              </div>
            </div>
          </div>
        </div>
        
        {validationError && (
          <Alert variant="destructive" className="mb-6 rounded-2xl backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-md">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}
        
        {auditResult && auditResult.issues.length > 0 && (
          <Alert variant={auditResult.validRows > 0 ? "default" : "destructive"} className="mb-6 rounded-2xl backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-md">
            <Info className="h-5 w-5" />
            <AlertTitle>File Audit Results</AlertTitle>
            <AlertDescription>
              <div className="mt-2">
                <p className="font-medium">Summary:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Total rows: {auditResult.totalRows}</li>
                  <li>Valid rows: {auditResult.validRows}</li>
                  <li>Invalid rows: {auditResult.invalidRows}</li>
                  <li>Issues found: {auditResult.issues.length}</li>
                </ul>
                
                {auditResult.issues.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">Issues:</p>
                    <ul className="pl-5 mt-1 space-y-2">
                      {auditResult.issues.slice(0, 5).map((issue, index) => (
                        <li key={index} className="flex items-start gap-2">
                          {renderIssueIcon(issue)}
                          <div>
                            <p className="text-sm font-medium">{issue.row ? `Row ${issue.row}: ` : ''}{issue.issue}</p>
                            {issue.suggestion && <p className="text-xs text-muted-foreground">Suggestion: {issue.suggestion}</p>}
                          </div>
                        </li>
                      ))}
                      {auditResult.issues.length > 5 && (
                        <li className="text-sm text-muted-foreground">
                          ... and {auditResult.issues.length - 5} more issues
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                
                {auditResult.warnings.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">Warnings:</p>
                    <ul className="pl-5 mt-1 space-y-1">
                      {auditResult.warnings.map((warning, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Main upload card with improved styling */}
        <Card className="shadow-xl rounded-2xl backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border border-gray-200/70 dark:border-gray-600/50 overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardTitle className="text-2xl text-gray-800 dark:text-white flex items-center gap-3">
              <Upload className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              Upload Trial Balance
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
              Upload your trial balance in CSV or Excel format to generate financial reports and analyze key ratios.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <FileUploader onFileSelect={handleFileSelect} />
          </CardContent>
          <CardFooter className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 bg-gray-50/70 dark:bg-gray-700/20">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="hidden md:block">Accepted formats:</span> 
              <span className="px-2 py-1 bg-gray-200/50 dark:bg-gray-700/50 rounded-md text-xs font-medium">.csv</span>
              <span className="px-2 py-1 bg-gray-200/50 dark:bg-gray-700/50 rounded-md text-xs font-medium">.xlsx</span>
              <span className="px-2 py-1 bg-gray-200/50 dark:bg-gray-700/50 rounded-md text-xs font-medium">.xls</span>
              <span className="px-2 py-1 bg-gray-200/50 dark:bg-gray-700/50 rounded-md text-xs font-medium">.ods</span>
            </p>
            <Button 
              onClick={parseFile} 
              disabled={!file || isUploading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 py-3 rounded-xl font-medium shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
              size="lg"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Process File
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-10">
          <FormatExample />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} FinAnalyst. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;