import { useState } from "react"
import { CheckCircle2, Pencil, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DataRowProps {
  label: string
  value: string
  verified?: boolean
  onSave: (newValue: string) => void
}

export default function DataRow({ label, value, verified = false, onSave }: DataRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  const handleSave = () => {
    onSave(tempValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempValue(value)
    setIsEditing(false)
  }

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between py-4 px-5 border-b border-gray-100/50 last:border-0 hover:bg-gray-50/50 transition-colors">
      <div className="flex-1 mb-2 sm:mb-0">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        {isEditing ? (
          <Input autoFocus value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="max-w-md" />
        ) : (
          <p className="text-sm font-semibold text-gray-800">
            {value || <span className="text-gray-400 italic">Sin información</span>}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 pl-0 sm:pl-4">
        {!isEditing && verified && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50/80 border border-green-100/50 rounded-full">
            <CheckCircle2 size={12} className="text-green-500 fill-green-500/10" strokeWidth={3} />
            <span className="text-xs font-bold text-green-700 uppercase">Validado</span>
          </div>
        )}

        {isEditing ? (
          <div className="flex gap-2">
            <button 
              onClick={handleCancel} 
              className="h-8 w-8 rounded-lg inline-flex items-center justify-center transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 text-red-500 hover:text-red-600 hover:bg-red-50/80 border border-transparent hover:border-red-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1"
              aria-label="Cancelar"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
            <button 
              onClick={handleSave} 
              className="h-8 w-8 rounded-lg inline-flex items-center justify-center transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 text-green-600 hover:text-green-700 hover:bg-green-50/80 border border-transparent hover:border-green-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1"
              aria-label="Guardar"
            >
              <CheckCircle2 size={16} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 rounded-lg inline-flex items-center justify-center transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 hover:bg-blue-50/80 border border-transparent hover:border-blue-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
            aria-label="Editar"
          >
            <Pencil size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  )
}
