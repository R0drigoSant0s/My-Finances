import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import Transactions from "@/pages/transactions";
import Goals from "@/pages/goals";
import CreditCards from "@/pages/credit-cards";
import Settings from "@/pages/settings";

function AppRouter() {

  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/home" component={Home} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/goals" component={Goals} />
      <Route path="/credit-cards" component={CreditCards} />
      <Route path="/settings" component={Settings} />
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;