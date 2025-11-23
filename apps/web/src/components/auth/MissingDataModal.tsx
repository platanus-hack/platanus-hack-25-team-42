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
import { inputTypeMapping } from "@/utils/input_types";
import { hardcodedValues } from "@/utils/hardcoded_values";

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
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
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
      setFileName(null);
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
          <DialogTitle>Agregar información faltante</DialogTitle>
          <DialogDescription>
            Por favor, proporcione la siguiente información para continuar.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center hover:bg-gray-100 transition-colors cursor-pointer relative">
            <input
              type="file"
              disabled={isProcessingFile}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              onChange={(e) => {
                if (e.target.files?.length) {
                  const file = e.target.files[0];
                  setIsProcessingFile(true);
                  setFileName(null);

                  setTimeout(() => {
                    setFileName(file.name);
                    setValues((prev) => {
                      const newValues = { ...prev };
                      scopes.forEach((scope) => {
                        if (hardcodedValues[scope]) {
                          newValues[scope] = hardcodedValues[scope];
                        }
                      });
                      return newValues;
                    });
                    setIsProcessingFile(false);
                  }, 4000);
                }
              }}
            />
            <div className="space-y-1">
              {isProcessingFile ? (
                <div className="flex flex-col items-center justify-center py-2">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-yellow-200 border-t-yellow-700"></div>
                  <p className="mt-2 text-sm text-gray-600">
                    Procesando documento...
                  </p>
                </div>
              ) : fileName ? (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-sm text-gray-900 font-medium">
                    {fileName}
                  </div>
                  <div className="text-xs text-green-600">
                    Archivo procesado correctamente
                  </div>
                </>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-yellow-700 hover:text-yellow-600">
                      Sube un archivo
                    </span>{" "}
                    para autocompletar
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-sm text-gray-500">
                O ingresa los datos manualmente
              </span>
            </div>
          </div>

          {scopes.map((scope) => (
            <div key={scope} className="space-y-2">
              <label className="text-sm font-medium capitalize">
                {scopeTranslations[scope] || scope.replace(/_/g, " ")}
              </label>
              <Input
                type={inputTypeMapping[scope] || "text"}
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
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !allFieldsFilled}
            className="w-full sm:w-auto px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-700 hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
