// in /components/CreateUserDialog.tsx

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { adminCreateUser } from '@/lib/api';
import { AdminCreateUserFormValues, adminCreateUserFormSchema } from '@/lib/formschemas';
import { Plus } from 'lucide-react';

interface AdminCreateUserDialogProps {
  role?: number;
  onUserCreated?: () => void;
  buttonClassName?: string;
}

export function AdminCreateUserDialog({ 
  role = 2, 
  onUserCreated, 
  buttonClassName 
}: AdminCreateUserDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  
  const form = useForm<AdminCreateUserFormValues>({
    resolver: zodResolver(adminCreateUserFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
      agent_code: '',
      password: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (data: AdminCreateUserFormValues) => {
    try {
      const { confirm_password, ...userData } = data;
      await adminCreateUser({ ...userData, role });
      
      toast({
        title: "Success",
        description: "User created successfully",
      });
      
      setOpen(false);
      form.reset();
      onUserCreated?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={buttonClassName}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter phone number" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="agent_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Producer Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ABCD123"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        field.onChange(value);
                      }}
                      maxLength={7}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create User</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}