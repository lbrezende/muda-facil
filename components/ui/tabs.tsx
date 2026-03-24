"use client";

import { Tabs as TabsPkg } from "radix-ui";
import { cn } from "@/lib/utils";

const TabsRoot = TabsPkg.Root;
const TabsListPrimitive = TabsPkg.List;
const TabsTriggerPrimitive = TabsPkg.Trigger;
const TabsContentPrimitive = TabsPkg.Content;

function Tabs({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsRoot>) {
  return <TabsRoot className={cn(className)} {...props} />;
}

function TabsList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsListPrimitive>) {
  return (
    <TabsListPrimitive
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsTriggerPrimitive>) {
  return (
    <TabsTriggerPrimitive
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsContentPrimitive>) {
  return (
    <TabsContentPrimitive
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
