import { useState } from "react"
import { CheckCircle2, Pencil, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
            <Button variant="ghost" size="sm" onClick={handleCancel} className="text-red-500 hover:bg-red-50">
              <X size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSave} className="text-green-600 hover:bg-green-50">
              <CheckCircle2 size={16} />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600"
          >
            <Pencil size={14} />
          </Button>
        )}
      </div>
    </div>
  )
}
