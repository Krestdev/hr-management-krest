'use client'
import Header from '@/components/header'
import NotificationItem from '@/components/notification-item'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { demoNotifications } from '@/data/temp'
import { Notification02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Notification } from '@/types/types'

function Page() {
  const { data, isSuccess } = useQuery({
    queryKey: ["notifications"],
    queryFn: async():Promise<Notification[]>=>demoNotifications
  });
  if(isSuccess)
  return (
    <div className="grid gap-4 sm:gap-6">
      <Header title="Notifications" variant={"primary"}/>
      <div className="card-1">
        <div className="card-1-header flex-row gap-2 items-center">
          <span className="card-1-icon bg-accent">
            <HugeiconsIcon icon={Notification02Icon} />
          </span>
          <h3>{"Liste des notifications"}</h3>
        </div>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">{"Toutes"}</TabsTrigger>
            <TabsTrigger value="unread">{"Non lues"}</TabsTrigger>
            <TabsTrigger value="read">{"Lues"}</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="grid gap-1">
              {
                data.length === 0 ?
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant={"icon"}>
                      <HugeiconsIcon icon={Notification02Icon}/>
                    </EmptyMedia>
                    <EmptyTitle>{"Aucune notification"}</EmptyTitle>
                    <EmptyDescription>{"Vous n'avez pas de notifications."}</EmptyDescription>
                  </EmptyHeader>
                </Empty>
                :
                data.map((item)=>(
                  <NotificationItem key={item.id} {...item} />
                ))
              }
            </div>
          </TabsContent>
          <TabsContent value="unread">
            <div className="grid gap-1">
              {
                data.filter(w=>w.status==="UNREAD").length === 0 ?
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant={"icon"}>
                      <HugeiconsIcon icon={Notification02Icon}/>
                    </EmptyMedia>
                    <EmptyTitle>{"Aucune notification"}</EmptyTitle>
                    <EmptyDescription>{"Vous n'avez pas de notifications."}</EmptyDescription>
                  </EmptyHeader>
                </Empty>
                :
                data.filter(w=>w.status==="UNREAD").map((item)=>(
                  <NotificationItem key={item.id} {...item} />
                ))
              }
            </div>
          </TabsContent>
          <TabsContent value="read">
            <div className="grid gap-1">
              {
                data.filter(w=>w.status==="READ").length === 0 ?
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant={"icon"}>
                      <HugeiconsIcon icon={Notification02Icon}/>
                    </EmptyMedia>
                    <EmptyTitle>{"Aucune notification"}</EmptyTitle>
                    <EmptyDescription>{"Vous n'avez pas de notifications."}</EmptyDescription>
                  </EmptyHeader>
                </Empty>
                :
                data.filter(w=>w.status==="READ").map((item)=>(
                  <NotificationItem key={item.id} {...item} />
                ))
              }
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Page