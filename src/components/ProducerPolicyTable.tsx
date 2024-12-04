import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { PolicyData, RenewalPolicyData } from '@/lib/models';
import programFullNames, { ProgramCode } from '@/lib/const';
import ProducerPolicyDetailsCard from './ProducerPolicyDetailsCard';



interface PolicyTableProps {
  policies: RenewalPolicyData[];
  onPageChange: (page: number) => void;
  onSearchChange: (value: string) => void;
  onEntriesChange: (value: number) => void;
  totalEntries: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
}

const ProducerPolicyTable: React.FC<PolicyTableProps> = ({
  policies,
  onPageChange,
  onSearchChange,
  onEntriesChange,
  totalEntries,
  currentPage,
  pageSize,
  isLoading,
}) => {
  const totalPages = Math.ceil(totalEntries / pageSize);
  const startEntry = currentPage * pageSize + 1;
  const endEntry = Math.min((currentPage + 1) * pageSize, totalEntries);
  const [selectedPolicy, setSelectedPolicy] = useState<RenewalPolicyData | null>(null);
  const [searchValue, setSearchValue] = useState("");  // Local state for input value

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchChange(searchValue);
    }
  };
  const getLineOfBusiness = (policyNumber: string) => {
    const prefix = policyNumber.substring(0, 3).toUpperCase() as ProgramCode;
    const fullName = programFullNames[prefix] || 'Unknown Program';
    return (
      <div>
        <span className="font-medium">{prefix}</span>
        <span className="block text-sm text-gray-500">{fullName}</span>
      </div>
    );
  };

  // Function to generate visible page numbers
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 0; i <= Math.min(delta - 1, totalPages - 1); i++) {
      range.push(i);
    }
    if (currentPage - delta > delta - 1) {
      range.push(-1);
    }
    for (let i = Math.max(currentPage - delta, delta); i <= Math.min(currentPage + delta, totalPages - delta - 1); i++) {
      range.push(i);
    }
    if (currentPage + delta < totalPages - delta) {
      range.push(-1);
    }
    for (let i = Math.max(totalPages - delta, currentPage + delta + 1); i < totalPages; i++) {
      range.push(i);
    }

    return range;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Show</span>
          <Select 
            defaultValue={pageSize.toString()} 
            onValueChange={(value) => onEntriesChange(parseInt(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm">entries</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Search:</span>
          <Input
            placeholder="Search and press Enter..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="rounded-md border relative">
      {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Policy No</TableHead>
              <TableHead>Insureds Name</TableHead>
              <TableHead>Zip Code</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy, index) => (
              <TableRow key={policy.policynum2}>
                <TableCell>{startEntry + index}</TableCell>
                <TableCell>{policy.expdate}</TableCell>
                <TableCell>{policy.policynum2}</TableCell>
                <TableCell>{policy.firmname}</TableCell>
                <TableCell>{policy.zipcode}</TableCell>
                <TableCell>
                  <Button variant="secondary" size="sm" onClick={() => setSelectedPolicy(policy)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {startEntry} to {endEntry} of {totalEntries} entries
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 0) onPageChange(currentPage - 1);
                }}
                className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {getVisiblePages().map((pageNum, i) => (
              <PaginationItem key={i}>
                {pageNum === -1 ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(pageNum);
                    }}
                    isActive={currentPage === pageNum}
                  >
                    {pageNum + 1}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages - 1) onPageChange(currentPage + 1);
                }}
                className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {selectedPolicy && (
        <ProducerPolicyDetailsCard
          policy={selectedPolicy}
          isOpen={!!selectedPolicy}
          onClose={() => setSelectedPolicy(null)}
        />
      )}
    </div>
  );
};

export default ProducerPolicyTable;