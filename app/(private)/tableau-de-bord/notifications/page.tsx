"use client";
import Header from "@/components/header";
import NotificationItem from "@/components/notification-item";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoNotifications } from "@/data/temp";
import { Notification02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { Notification } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import LoadingComponent from "@/components/loading-comp";
import ErrorComponent from "@/components/error-comp";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/dateRagePicker";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

function Page() {
  const { data, isSuccess, isLoading, isError, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<Notification[]> => demoNotifications,
  });
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: undefined,
      to: undefined,
    });
  const [types, setTypes] = useState<Array<string>>([]);

  useEffect(() => {
    if (isSuccess && data) {
      const uniqueTypes = Array.from(
        new Set(
          data.map((n)=>n.title)
        )
      );
      setTypes(uniqueTypes);
    }
  }, [isSuccess, data, setTypes]);

  const filteredData = useMemo(()=>{
    if(isSuccess && !!data){
      return data
      .filter((notification)=>{
        const matchType = typeFilter === "all" ||
        typeFilter === notification.title;

        // ----- filtre dates -----
        const from = dateRange?.from;
        const to = dateRange?.to;

        const start = new Date(notification.createdAt);
        let matchDate = true;
        if (from && !to) {
              matchDate = start >= from;
            } else if (!from && to) {
              matchDate = start <= to;
            } else if (from && to) {
              matchDate = start >= from && start <= to;
            }

        return matchType && matchDate;
      })
    }
    return [];

  },[isSuccess, data, typeFilter, dateRange]);

  if (isLoading) {
    return (
      <LoadingComponent/>
    );
  }
  if(isError){
    return <ErrorComponent description={error.message}/>
  }
  if(!isSuccess){
    return null;
  }

  const handleMarkAsRead = (id: number) => {
    //to complete later
  };

  const resetFilters = () => {
    setTypeFilter("all");
    setDateRange(undefined);
  }

  const all = filteredData;
  const unread = filteredData.filter((w) => w.status === "UNREAD");
  const read = filteredData.filter((w) => w.status === "READ");

  const listEmpty = (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant={"icon"}>
          <HugeiconsIcon icon={Notification02Icon} />
        </EmptyMedia>
        <EmptyTitle>{"Aucune notification"}</EmptyTitle>
        <EmptyDescription>
          {"Vous n'avez pas de notifications."}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );

  const animationProps = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.2 },
    layout: true as const,
  };

  return (
    <div className="grid gap-4 sm:gap-6">
      <Header title="Notifications" variant={"primary"} />
      <div className="card-1">
        <div className="card-1-header flex-row gap-2 items-center justify-between flex-wrap">
          <div className="flex items-center gap-2">
            <span className="card-1-icon bg-accent">
              <HugeiconsIcon icon={Notification02Icon} />
            </span>
            <h3>{"Liste des notifications"}</h3>
          </div>
          <div className="filters">
            <div className="filter-group">
              <Label htmlFor='status'>{"Statut"}</Label>
              <Select name="status" value={typeFilter} 
              onValueChange={setTypeFilter}>
                  <SelectTrigger className="min-w-32">
                      <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">{"Tous"}</SelectItem>
                      {
                        types.map((item)=>(
                          <SelectItem key={item} value={item}>{item}</SelectItem>
                        ))
                      }
                  </SelectContent>
              </Select>
              </div>
            <div className="filter-group">
                <Label htmlFor="date">{"Période"}</Label>
                <DateRangePicker
                  date={dateRange}
                  onChange={setDateRange}
                  className="min-w-40"/>
            </div>
            <Button onClick={resetFilters} variant={"outline"}>{"Réinitialiser"}</Button>
          </div>
        </div>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">{"Toutes"}</TabsTrigger>
            <TabsTrigger value="unread">{"Non lues"}</TabsTrigger>
            <TabsTrigger value="read">{"Lues"}</TabsTrigger>
          </TabsList>

          {/* TOUTES */}
          <TabsContent value="all">
            <div className="grid gap-1">
              {all.length === 0 ? (
                listEmpty
              ) : (
                <AnimatePresence mode="popLayout">
                  {all.map((item) => (
                    <motion.div key={item.id} {...animationProps}>
                      <NotificationItem
                        {...item}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </TabsContent>

          {/* NON LUES */}
          <TabsContent value="unread">
            <div className="grid gap-1">
              {unread.length === 0 ? (
                listEmpty
              ) : (
                <AnimatePresence mode="popLayout">
                  {unread.map((item) => (
                    <motion.div key={item.id} {...animationProps}>
                      <NotificationItem
                        {...item}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </TabsContent>

          {/* LUES */}
          <TabsContent value="read">
            <div className="grid gap-1">
              {read.length === 0 ? (
                listEmpty
              ) : (
                <AnimatePresence mode="popLayout">
                  {read.map((item) => (
                    <motion.div key={item.id} {...animationProps}>
                      <NotificationItem
                        {...item}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Page;
