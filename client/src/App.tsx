import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import ProcessingHistory from "@/pages/ProcessingHistory";
import AISettings from "@/pages/AISettings";
import MaterialCatalog from "@/pages/MaterialCatalog";
import ClassificationGuide from "@/pages/ClassificationGuide";
import MaterialStandardization from "@/pages/MaterialStandardization";
import Account from "@/pages/Account";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/history" component={ProcessingHistory} />
      <Route path="/ai-settings" component={AISettings} />
      <Route path="/catalog" component={MaterialCatalog} />
      <Route path="/classification" component={ClassificationGuide} />
      <Route path="/standardization" component={MaterialStandardization} />
      <Route path="/account" component={Account} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <Router />
      </AppLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
