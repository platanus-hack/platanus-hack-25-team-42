import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createUserData } from "@/db/crud/user_data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { userDataTypeList } from "@/db/data_types";
import { useRouter } from "@tanstack/react-router";
import { scopeTranslations } from "@/utils/translations";

interface MissingDataModalProps {
  scopes: string[];
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function MissingDataModal({
  scopes,
  userId,
  isOpen,
  onClose,
}: MissingDataModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      // Create all missing data entries
      for (const scope of scopes) {
        const type = scope as (typeof userDataTypeList)[number];
        if (!userDataTypeList.includes(type)) {
          throw new Error(`Invalid scope: ${scope}`);
        }

        const value = values[scope];
        if (!value) {
          throw new Error(`Missing value for ${scope}`);
        }

        await createUserData({
          data: {
            id: crypto.randomUUID(),
            userId,
            type,
            value,
            isValidated: true,
          },
        });
      }
    },
    onSuccess: () => {
      router.invalidate();
      onClose();
      setValues({});
    },
  });

  const handleValueChange = (scope: string, value: string) => {
    setValues((prev) => ({ ...prev, [scope]: value }));
  };

  const allFieldsFilled = scopes.every((scope) => values[scope]?.trim());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Missing Information</DialogTitle>
          <DialogDescription>
            Please provide the following information to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {scopes.map((scope) => (
            <div key={scope} className="space-y-2">
              <label className="text-sm font-medium capitalize">
                {scopeTranslations[scope] || scope.replace(/_/g, " ")}
              </label>
              <Input
                value={values[scope] || ""}
                onChange={(e) => handleValueChange(scope, e.target.value)}
                placeholder={`Ingrese su ${
                  scopeTranslations[scope]?.toLowerCase() ||
                  scope.replace(/_/g, " ")
                }`}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !allFieldsFilled}
            className="w-full sm:w-auto px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? (
              <>
                <span className="animate-pulse mr-2">⏳</span>
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
