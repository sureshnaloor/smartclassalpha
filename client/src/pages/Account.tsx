import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, Settings, Key, UserCog, Lock, Bell, Database } from 'lucide-react';
import { User as UserType } from '@/types';

// Mock current user for display purposes
const currentUser: UserType = {
  id: 1,
  username: 'johndoe',
  initials: 'JD',
  name: 'John Doe',
  role: 'Material Administrator',
};

export default function Account() {
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();
  
  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully",
    });
  };
  
  const handleSavePassword = () => {
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully",
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences saved",
      description: "Your notification settings have been updated",
    });
  };
  
  const handleSaveAPISettings = () => {
    toast({
      title: "API settings saved",
      description: "Your API configuration has been updated",
    });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account preferences and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-semibold">
              {currentUser.initials}
            </div>
            <div>
              <h3 className="text-lg font-medium">{currentUser.name}</h3>
              <p className="text-sm text-gray-500">{currentUser.role}</p>
              <p className="text-xs text-gray-400 mt-1">Account ID: {currentUser.id}</p>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full mb-6">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center">
                <Key className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">API</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue={currentUser.name} />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue={currentUser.username} />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue={currentUser.role} disabled />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <textarea 
                  id="bio" 
                  rows={3} 
                  className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" 
                  defaultValue="Material master data specialist with 5+ years of experience in ERP systems."
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                  Save Profile
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <div>
                      <p className="text-sm font-medium">Authenticator App</p>
                      <p className="text-xs text-gray-500">Use an authenticator app to generate one-time codes</p>
                    </div>
                    <Button variant="outline" size="sm">Setup</Button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSavePassword}>
                    Change Password
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Email Notifications</h4>
                <div className="space-y-2">
                  {[
                    "Processing completion notifications",
                    "Batch processing results",
                    "System updates and new features",
                    "Error and warning alerts"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`notification-${index}`} 
                        defaultChecked={index < 2} 
                        className="rounded border-gray-300 text-primary focus:ring-primary/25"
                      />
                      <label htmlFor={`notification-${index}`} className="ml-2 text-sm">{item}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>
                  Save Preferences
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="apiProvider">API Provider</Label>
                  <Input id="apiProvider" defaultValue="OpenAI" disabled />
                </div>
                
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex space-x-2">
                    <Input id="apiKey" type="password" defaultValue="••••••••••••••••••••••" disabled />
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    API Key is managed by system administrators via environment variables
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="modelPreference">Default Model Preference</Label>
                  <select 
                    id="modelPreference" 
                    className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option value="gpt-4o">GPT-4o (OpenAI)</option>
                    <option value="gpt-4">GPT-4 Turbo (OpenAI)</option>
                    <option value="gpt-3.5">GPT-3.5 Turbo (OpenAI)</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveAPISettings}>
                    Save API Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
