import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ArrowDown, ArrowUp } from 'lucide-react'

function StatisticCard() {
  return (
    <Card key={index} className={`relative overflow-hidden ${stat.bg} text-white`}>
            <CardHeader className="border-0 z-10 relative">
              <CardTitle className="text-white/90 text-sm font-medium">{stat.title}</CardTitle>
              <CardToolbar>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="dim" size="sm" mode="icon" className="-me-1.5 text-white/80 hover:text-white">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="bottom">
                    <DropdownMenuItem>
                      <Settings /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <TriangleAlert /> Add Alert
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pin /> Pin to Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 /> Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      <Trash /> Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardToolbar>
            </CardHeader>
            <CardContent className="space-y-2.5 z-10 relative">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl font-semibold tracking-tight">
                  {stat.format ? stat.format(stat.value) : stat.prefix + formatNumber(stat.value) + stat.suffix}
                </span>
                <Badge className="bg-white/20 font-semibold">
                  {stat.delta > 0 ? <ArrowUp /> : <ArrowDown />}
                  {stat.delta}%
                </Badge>
              </div>
              <div className="text-xs text-white/80 mt-2 border-t border-white/20 pt-2.5">
                Vs last month:{' '}
                <span className="font-medium text-white">
                  {stat.lastFormat
                    ? stat.lastFormat(stat.lastMonth)
                    : stat.prefix + formatNumber(stat.lastMonth) + stat.suffix}
                </span>
              </div>
            </CardContent>
          </Card>
  )
}

export default StatisticCard