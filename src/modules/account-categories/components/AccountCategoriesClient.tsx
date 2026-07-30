"use client";
import { useState } from "react";
import { AccountCategoriesTable, AccountCategoryDrawer } from "../components";
import { IAccountCategory } from "../interfaces/category.interface";
import { Button } from "@heroui/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { deleteAccountCategory } from "../actions/delete";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const CreateCategoryButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <Button
        variant="primary"
        onPress={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <HugeiconsIcon icon={PlusSignIcon} size={18} />
        Nueva Categoría
      </Button>
      <AccountCategoryDrawer
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSuccess={() => router.refresh()}
      />
    </>
  );
};

export const AccountCategoriesClient = ({ categories }: { categories: IAccountCategory[] }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IAccountCategory | null>(null);
  const router = useRouter();

  const handleEdit = (category: IAccountCategory) => {
    setSelectedCategory(category);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (category: IAccountCategory) => {
    if (confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
      const res = await deleteAccountCategory(category.id);
      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.refresh();
      }
    }
  };

  const handleDrawerClose = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setTimeout(() => setSelectedCategory(null), 300);
    }
  };

  return (
    <>
      <AccountCategoriesTable
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <AccountCategoryDrawer
        isOpen={isDrawerOpen}
        onOpenChange={handleDrawerClose}
        category={selectedCategory}
        onSuccess={() => router.refresh()}
      />
    </>
  );
};
