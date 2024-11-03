import React, { useState, useEffect } from 'react';
import Cloudeka from './Cloudeka';
import Samrat from './Samrat';
import { Button, Tabs } from "@material-tailwind/react";


const Dashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>('cloudeka'); // Default selected tab

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Server Daily Report Dashboard</h1>
      
      <div className="mb-4">
      <Tabs defaultValue="Cloudeka">
        <Tabs.List className="w-full bg-light text-black">
          <Tabs.Trigger className="w-full" value="Cloudeka">
            Cloudeka
          </Tabs.Trigger>
          <Tabs.Trigger className="w-full" value="Samrat">
            Samrat
          </Tabs.Trigger>
          <Tabs.TriggerIndicator />
        </Tabs.List>
        <Tabs.Panel value="Cloudeka">
          <Cloudeka />
        </Tabs.Panel>
        <Tabs.Panel value="Samrat">
          <Samrat />
        </Tabs.Panel>
    </Tabs>
      </div>
    </div>
    
  );
};

export default Dashboard;
