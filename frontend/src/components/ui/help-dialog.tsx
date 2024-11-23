import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Button } from "./button";
import { CircleHelp } from "lucide-react";

interface ShortcutInfo {
  key: string;
  description: string;
}

const shortcuts: ShortcutInfo[] = [
  { key: "M", description: "Toggle transform control mode (Translate/Rotate/Scale)" },
  
  { key: "Esc", description: "Deselect current object" },
  { key: "Right Click + Drag", description: "Pan camera" },
  { key: "Scroll", description: "Zoom camera" },
  { key: "Left Click + Drag", description: "Rotate camera" },
  { key: "Right Click + Drag", description: "Pan camera" },
/*   { key: "Ctrl + Z", description: "Undo last action" },
  { key: "Delete", description: "Delete selected object" },
  { key: "Ctrl + Y", description: "Redo last action" },
  { key: "Alt + Drag", description: "Orbit camera" },
   */
];

export function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 bottom-4 rounded-full w-8 h-8 bg-background/80  backdrop-blur-sm hover:bg-accent"
        >
          <CircleHelp className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white bg-opacity-10 backdrop-blur-sm border-none text-white">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts & Controls</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center gap-4 px-4 text-sm"
            >
              <kbd className="px-3 py-1.5 text-sm font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg shadow-[0_2px_0_0_rgba(0,0,0,0.1)] min-w-[80px] text-center inline-block">
                {shortcut.key}
              </kbd>
              <span>{shortcut.description}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
