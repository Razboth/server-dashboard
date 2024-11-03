import React, { useState, useEffect } from 'react';
import { Modal } from 'flowbite-react';
import { Card, Typography, Button, Popover, Dialog, IconButton,
  Chip,
  Avatar,
  Tooltip,
  Input, } from "@material-tailwind/react";

interface Server {
  id: number;
  serverName: string;
  ipAddresses: string[];
  osType: string;
}

interface Partition {
  partition: string;
  usage: number;
}

interface Health {
  serverTime: string;
  serverId: number;
  cpuUsage: number;
  ramUsage: number;
  partitions: Partition[];
}

interface AllHealth{
  serverTime: string;
  serverId: number;
  cpuUsage: number;
  ramUsage: number;
  partitions: Partition[];
}

const Cloudeka: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [healths, setHealths] = useState<Health[]>([]);
  const [Allhealths, setAllHealths] = useState<AllHealth[]>([]);

  // Fetch the data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3002/data/cloudeka');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setServers(data.Server);
        setHealths(data.Health);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  // Helper function to get health data for the selected server
  const getHealthForServer = (serverId: number) => {
    return healths.find((health) => health.serverId === serverId);
  };


  const fetchHealthData = async (serverId: number) => {
    try {
      const AllHealts = await fetch(`http://localhost:3002/health/server-${serverId}/health`);
      if (!AllHealts.ok) {
        throw new Error(`HTTP error! status: ${AllHealts.status}`);
      }
      const dataHealth = await AllHealts.json();
      console.log(dataHealth);
      setAllHealths(dataHealth);
    } catch (error) {
      console.error('Error fetching health data:', error);
    }
  };


  return (
    <div className={`container mx-auto p-4`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servers.map((server) => (

          <Card className="max-w-xs" key={server.id}>
            <Card.Body>
              <Typography type="h6">{server.serverName}</Typography>
              <Typography className="my-1 text-foreground">
                IP Address:
              </Typography>
              <Typography className="my-1 text-foreground">
                {server.ipAddresses.join(', ')}
              </Typography>
              <Typography className="my-1 text-foreground">
                OS Type: {server.osType}
              </Typography>
            </Card.Body>
            <Card.Footer>
            <Dialog>
              <Dialog.Trigger as={Button} onClick={() => fetchHealthData(server.id)}>Check Details</Dialog.Trigger>
              <Dialog.Overlay>
              <Dialog.Content className='bg-white'>
                <div className="flex items-center justify-between mb-3">
                  <Typography type="h6">{server.serverName} | Server Health | {new Date(getHealthForServer(server.id)!.serverTime).toLocaleString()}</Typography>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center mb-2 mt-5">
                  <Card className="max-w-xs align-middle">
                    <Card.Body>
                      <Typography type="h6">CPU Usage</Typography>
                        <Typography type="h1" color="primary">
                          {getHealthForServer(server.id)!.cpuUsage}%
                        </Typography>
                    </Card.Body>
                  </Card>

                  <Card className="max-w-xs">
                    <Card.Body>
                      <Typography type="h6">RAM Usage</Typography>
                      <Typography type="h1" color="primary">
                          {getHealthForServer(server.id)!.ramUsage}%
                        </Typography>
                    </Card.Body>
                  </Card>

                  <Card className="max-w-xs">
                    <Card.Body>
                      <Typography type="h6">Partitions</Typography>
                      <Typography type="h2" color="primary">
                          {getHealthForServer(server.id)!.partitions.map((partition, index) => (
                          <Typography key={index} color="primary">
                            <strong>{partition.partition}:</strong> {partition.usage}%
                          </Typography>
                          ))}
                        </Typography>
                    </Card.Body>
                  </Card>
                </div>
                <hr></hr>
                <div className="flex items-center justify-between mb-3">
                  <Typography type="h6">Last Server Infos</Typography>
                </div>
                <div className='flex items-center justify-between mb-3'>
                  <Card className="max-w-xs align-middle">
                      <Card.Body>
                        <Typography>CPU Usage : 56%</Typography>
                        <Typography>CPU Usage : 56%</Typography>
                        <Typography>CPU Usage : 56%</Typography>
                        <Typography>CPU Usage : 56%</Typography>
                        <Typography>CPU Usage : 56%</Typography>
                      </Card.Body>
                  </Card>
                </div>
                <div className="mb-1 flex items-center justify-end gap-2">
                  <Dialog.DismissTrigger as={Button} variant="ghost" color="error">
                    Close
                  </Dialog.DismissTrigger>
                </div>
              </Dialog.Content>
            </Dialog.Overlay>
            </Dialog>
            </Card.Footer>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default Cloudeka;
