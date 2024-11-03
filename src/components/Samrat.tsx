import React, { useState, useEffect } from 'react';
import { Modal } from 'flowbite-react';
import { Card, Typography, Button, Popover, Dialog, IconButton, } from "@material-tailwind/react";

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

const Samrat: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [healths, setHealths] = useState<Health[]>([]);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch the data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3002/data/samrat');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setServers(data.Server);
        setHealths(data.Health);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to handle card click
  const handleCardClick = (server: Server) => {
    setSelectedServer(server);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedServer(null);
  };

  // Helper function to get health data for the selected server
  const getHealthForServer = (serverId: number) => {
    return healths.find((health) => health.serverId === serverId);
  };

  return (
    <div className={`container mx-auto p-4`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servers.map((server) => (

          <Card className="max-w-xs">
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
              <Dialog.Trigger as={Button}>Open Dialog</Dialog.Trigger>
              <Dialog.Overlay>
              <Dialog.Content className='bg-white'>
                <div className="flex items-center justify-between gap-4">
                  <Typography type="h6">{server.serverName} | Server Health</Typography>
                </div>
                <Typography className="mb-2 mt-2 text-foreground">
                  Date Taken : {new Date(getHealthForServer(server.id)!.serverTime).toLocaleString()}
                </Typography>
                <Typography className="my-1 mb-2 text-foreground">
                  CPU Usage: {getHealthForServer(server.id)!.cpuUsage}%
                </Typography>
                <Typography className="my-1 mb-2 text-foreground">
                  RAM Usage: {getHealthForServer(server.id)!.ramUsage}%
                </Typography>
                <Typography className="my-1 mb-2 text-foreground">
                  Partitions: 
                  {getHealthForServer(server.id)!.partitions.map((partition, index) => (
                  <p key={index} className="text-gray-600">
                    <strong>{partition.partition}:</strong> {partition.usage}%
                  </p>
                  ))}
                </Typography>
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

      {/* Modal for showing server health details */}
      {selectedServer && (
        <Modal show={isModalOpen} onClose={closeModal}>
          <Modal.Header>{selectedServer.serverName} - Health Details</Modal.Header>
          <Modal.Body>
            <p className="text-gray-700 mb-4">OS: {selectedServer.osType}</p>
            <p className="text-gray-700 mb-4">
              IPs: {selectedServer.ipAddresses.join(', ')}
            </p>

            {/* Health details */}
            {getHealthForServer(selectedServer.id) ? (
              <div>
                <p className="text-gray-700">
                  <strong>Server Time:</strong>{' '}
                  {new Date(getHealthForServer(selectedServer.id)!.serverTime).toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>CPU Usage:</strong> {getHealthForServer(selectedServer.id)!.cpuUsage}%
                </p>
                <p className="text-gray-700">
                  <strong>RAM Usage:</strong> {getHealthForServer(selectedServer.id)!.ramUsage}%
                </p>
                <h3 className="text-md font-semibold mt-4">Partitions:</h3>
                {getHealthForServer(selectedServer.id)!.partitions.map((partition, index) => (
                  <p key={index} className="text-gray-600">
                    <strong>{partition.partition}:</strong> {partition.usage}%
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No health data available for this server</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              onClick={closeModal}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Samrat;
