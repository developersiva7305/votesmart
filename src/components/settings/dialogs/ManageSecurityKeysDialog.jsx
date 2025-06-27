
import React, { useState } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Key, PlusCircle, Trash2, ListChecks } from 'lucide-react';

const ManageSecurityKeysDialog = ({ currentUser, updateUserSetting }) => {
  // This state is local to the dialog for UI purposes.
  // The actual source of truth for securityKeys is currentUser.settings.securityKeys
  const [displayedKeys, setDisplayedKeys] = useState(currentUser?.settings?.securityKeys || []);

  const simulateRegisterSecurityKey = async () => {
    console.log("Simulating WebAuthn: Fetching registration options from server...");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    console.log("Simulating WebAuthn: Calling navigator.credentials.create()...");
    // This would be: const credential = await navigator.credentials.create({ publicKey: publicKeyOptions });
    // For simulation, we create a dummy credential object
    const dummyCredential = {
      id: `key-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      rawId: "dummyRawId",
      response: { clientDataJSON: "dummyClientDataJSON", attestationObject: "dummyAttestationObject" },
      type: "public-key",
      name: `Security Key #${(displayedKeys.length + 1)} (Simulated)`,
      registeredAt: new Date().toISOString(),
    };
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate user interaction with key

    console.log("Simulating WebAuthn: Sending credential to server for storage...");
    // In a real app, send dummyCredential to server. Here, we update localStorage via updateUserSetting.
    const newKeyEntry = { 
      id: dummyCredential.id, 
      name: dummyCredential.name, 
      registeredAt: dummyCredential.registeredAt 
    };
    const updatedKeys = [...displayedKeys, newKeyEntry];
    
    updateUserSetting('securityKeys', updatedKeys);
    setDisplayedKeys(updatedKeys); // Update local dialog state

    toast({
      title: "Security Key Registration (Simulated)",
      description: `${newKeyEntry.name} has been conceptually registered.`,
    });
  };

  const simulateRevokeSecurityKey = (keyIdToRevoke) => {
    console.log(`Simulating WebAuthn: Revoking key ${keyIdToRevoke}...`);
    
    const updatedKeys = displayedKeys.filter(key => key.id !== keyIdToRevoke);
    updateUserSetting('securityKeys', updatedKeys);
    setDisplayedKeys(updatedKeys); // Update local dialog state

    toast({
      title: "Security Key Revoked (Simulated)",
      description: `Key ID ${keyIdToRevoke.substring(0,8)}... has been conceptually revoked.`,
      variant: "destructive",
    });
  };

  return (
    <DialogContent className="sm:max-w-[525px] dark:bg-gray-800 dark:text-gray-200">
      <DialogHeader>
        <DialogTitle className="flex items-center text-xl dark:text-white">
          <Key className="mr-2 h-6 w-6 text-blue-500 dark:text-blue-400" />
          Manage Security Keys (WebAuthn)
        </DialogTitle>
        <DialogDescription className="dark:text-gray-400 pt-2">
          Register and manage your hardware security keys for an extra layer of authentication.
          This is a conceptual implementation using WebAuthn simulations.
        </DialogDescription>
      </DialogHeader>
      
      <div className="my-4">
        <Button onClick={simulateRegisterSecurityKey} className="w-full btn-primary dark:btn-primary-dark">
          <PlusCircle className="mr-2 h-4 w-4" /> Register New Security Key (Simulated)
        </Button>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
        <h4 className="text-md font-semibold flex items-center dark:text-gray-300">
          <ListChecks className="mr-2 h-5 w-5 text-green-500 dark:text-green-400" />
          Registered Keys:
        </h4>
        {displayedKeys.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No security keys registered yet.</p>
        ) : (
          displayedKeys.map((key) => (
            <div key={key.id} className="flex items-center justify-between p-3 border rounded-md bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600">
              <div>
                <p className="font-medium text-sm text-gray-700 dark:text-gray-200">{key.name || `Key ID: ${key.id.substring(0, 8)}...`}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Registered: {new Date(key.registeredAt).toLocaleDateString()}</p>
              </div>
              <Button variant="destructive-outline" size="sm" onClick={() => simulateRevokeSecurityKey(key.id)}>
                <Trash2 className="mr-1 h-3 w-3" /> Revoke
              </Button>
            </div>
          ))
        )}
      </div>

      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ManageSecurityKeysDialog;
