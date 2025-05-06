"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import React, { useMemo } from "react";
import { SelectSingleEventHandler } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTodoContext } from "@/context/TodoContext";
import { cn } from "@/lib/utils";
import { Todo } from "@/types/todo.type";

type DatePickerProps = {
  todo: Todo;
  setDate: SelectSingleEventHandler;
  date: Date | undefined;
};

export function DatePicker({ todo, date, setDate }: DatePickerProps): React.ReactElement<DatePickerProps> {
  const { updateTodo } = useTodoContext();

  const isOverdue = useMemo(() => {
    if (!date) return false;

    return date < new Date();
  }, [date]);

  const handlePopoverClose = (isClosed: boolean) => {
    if (!isClosed && !date) return;

    if (new Date(date ?? "").getTime() === new Date(todo.dueDate).getTime()) return;
    updateTodo(todo._id, { dueDate: date });
  };

  return (
    <Popover onOpenChange={handlePopoverClose}>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className={
            cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground") +
            " " +
            (isOverdue ? "text-destructive hover:text-destructive" : "")
          }>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
