import { useState, useEffect, useCallback } from 'react'
import { getEventDetails, updateEvent } from '../services/eventService'
import { submitVote } from '../services/voteService'
import { getCurrentDatetimeLocal } from '../utils/DateTimeUtils'
import { mapDetailsToUpdateDto } from '../utils/EventMappers'
import { EventDetailsDto, TimeOptionDto, RestaurantOptionDto } from '../types/Event'
import { CreateVoteDto } from '../types/Vote'

export interface UseEventDetailsResult {
  event: EventDetailsDto | null
  loading: boolean
  error: string | null
  selectedTime: number | null
  selectedRestaurant: number | null
  refresh: () => Promise<void>
  voteTime: (opt: TimeOptionDto) => Promise<void>
  voteRestaurant: (opt: RestaurantOptionDto) => Promise<void>
  closeVoting: () => Promise<void>
}

export function useEventDetails(eventId: number | null): UseEventDetailsResult {
  const [event, setEvent] = useState<EventDetailsDto | null>(null)
  const [selectedTime, setSelectedTime] = useState<number | null>(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (eventId === null) return
    setLoading(true)
    setError(null)
    try {
      const data = await getEventDetails(eventId)
      if (!data) {
        setError('Event not found')
      } else {
        setEvent(data)
        setSelectedTime(data.currentVote?.timeOptionId ?? null)
        setSelectedRestaurant(data.currentVote?.restaurantOptionId ?? null)
      }
    } catch (e) {
      console.error(e)
      setError('Failed to load event')
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const voteTime = useCallback(async (opt: TimeOptionDto) => {
    if (!event) return
    const dto: CreateVoteDto = {
      eventId: event.id,
      timeOptionId: selectedTime === opt.id ? null : opt.id,
      restaurantOptionId: selectedRestaurant,
    }
    await submitVote(dto)
    await refresh()
  }, [event, selectedTime, selectedRestaurant, refresh])

  const voteRestaurant = useCallback(async (opt: RestaurantOptionDto) => {
    if (!event) return
    const dto: CreateVoteDto = {
      eventId: event.id,
      timeOptionId: selectedTime,
      restaurantOptionId: selectedRestaurant === opt.id ? null : opt.id,
    }
    await submitVote(dto)
    await refresh()
  }, [event, selectedTime, selectedRestaurant, refresh])

  const closeVoting = useCallback(async () => {
    if (!event) return
    const now = getCurrentDatetimeLocal()
    const dto = mapDetailsToUpdateDto(event, now)
    await updateEvent(event.id, dto)
    setEvent(prev => prev ? { ...prev, votingDeadline: now } : prev)
  }, [event])

  return {
    event,
    loading,
    error,
    selectedTime,
    selectedRestaurant,
    refresh,
    voteTime,
    voteRestaurant,
    closeVoting,
  }
}
