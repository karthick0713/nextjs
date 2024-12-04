import React, { useState } from 'react';
import { AxiosError } from 'axios';
import { X, Save, AlertTriangle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AdminUserDetail, ServerErrors } from '@/lib/models';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import axios from '@/lib/axios';

interface UserDetailsProps {
  user: AdminUserDetail;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate?: () => void;
}

interface UserFormData {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  confirmPassword: string;
}

const AdminUserDetailsCard: React.FC<UserDetailsProps> = ({
  user,
  isOpen,
  onClose,
  onUserUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeactivateAlert, setShowDeactivateAlert] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: user.name,
    email: user.email,
    phone_number: user.phone_number?.toString(),
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Partial<UserFormData>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [serverErrors, setServerErrors] = useState<ServerErrors>({});
  const validateForm = () => {
    const newErrors: Partial<UserFormData> = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
    if (!/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Phone number must be exactly 10 digits';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        role: user.role,
        phone_number: parseInt(formData.phone_number),
        agent_code: user.agent_code,
        ...(formData.password && { password: formData.password })
      };

      await axios.put(`/api/admin/update-user`, payload);
      setIsEditing(false);
      if (onUserUpdate) onUserUpdate();
    } catch (error) {
      console.error('Error updating user:', error);
      if (error instanceof AxiosError && error.response?.data?.errors) {
        setServerErrors(error.response.data.errors);
      } else {
        setServerErrors({ 
          general: ['An unexpected error occurred. Please try again.'] 
        });
      }
      // Handle error (show toast notification, etc.)
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      await axios.put(`/api/admin/users/${user.id}/deactivate`);
      if (onUserUpdate) onUserUpdate();
      onClose();
    } catch (error) {
      console.error('Error deactivating user:', error);
      // Handle error
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <Card className="border-0 shadow-none">
            <CardHeader className="rounded-t-lg pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-green-800">
                  User Information: {user.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      disabled={!isEditing}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled={!isEditing}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="text"
                      value={formData.phone_number}
                      disabled={!isEditing}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData(prev => ({ ...prev, phone_number: value }));
                      }}
                      className={errors.phone_number ? "border-red-500" : ""}
                    />
                    {errors.phone_number && (
                      <span className="text-xs text-red-500">{errors.phone_number}</span>
                    )}
                  </div>

                  {isEditing && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className={errors.password ? "border-red-500" : ""}
                        />
                        {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className={errors.confirmPassword ? "border-red-500" : ""}
                        />
                        {errors.confirmPassword && (
                          <span className="text-xs text-red-500">{errors.confirmPassword}</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between px-6 pb-6">
            {Object.keys(serverErrors).length > 0 && (
                <div className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {Object.entries(serverErrors).map(([field, errors]) => (
                    <div key={field}>
                    {errors[0]}
                    </div>
                ))}
                </div>
            )}
              <Button
                variant="destructive"
                onClick={() => setShowDeactivateAlert(true)}
              >
                Deactivate User
              </Button>
              <div className="space-x-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                )}
              </div>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeactivateAlert} onOpenChange={setShowDeactivateAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate this user? They will no longer be able to access the system.
              This action can be reversed later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivate} className="bg-red-500 hover:bg-red-600">
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminUserDetailsCard;