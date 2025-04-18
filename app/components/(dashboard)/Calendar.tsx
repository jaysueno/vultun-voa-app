'use client';

import { Fragment, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog, Transition } from '@headlessui/react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/context/AuthContext';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  status: string;
  description?: string;
  notes?: string;
  service_id?: string;
  staff_id?: string;
  room_id?: string;
  customer_id?: string;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  description: string;
  capacity: number;
  base_price: number;
  category: string;
}

interface Staff {
  id: string;
  name: string;
  role: string;
}

interface Room {
  id: string;
  name: string;
  capacity: number;
}

interface BookingFormData {
  service_id: string;
  staff_id: string;
  start_time: string;
  end_time: string;
  notes: string;
}

interface Booking {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string;
  customer_id: string;
  service_id: string;
  staff_id: string;
  room_id: string;
  services: Array<{
    id: string;
    name: string;
    duration: number;
    description: string;
    price: number;
    category: string;
  }>;
  staff: Array<{
    id: string;
    full_name: string;
  }>;
  rooms: Array<{
    id: string;
    name: string;
  }>;
}

export default function Calendar() {
  const { user, loading } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    service_id: '',
    staff_id: '',
    start_time: '',
    end_time: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCalendarData();
  }, []);

  async function fetchCalendarData() {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch bookings with proper joins
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          start_time,
          end_time,
          status,
          notes,
          customer_id,
          service_id,
          staff_id,
          room_id,
          services (
            id,
            name,
            duration,
            description,
            base_price,
            category
          ),
          staff (
            id,
            full_name
          ),
          rooms (
            id,
            name
          )
        `)
        .order('start_time', { ascending: true });

      if (bookingsError) {
        console.error('Bookings fetch error:', bookingsError);
        throw new Error(`Error fetching bookings: ${bookingsError.message}`);
      }

      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (servicesError) {
        console.error('Services fetch error:', servicesError);
        throw new Error(`Error fetching services: ${servicesError.message}`);
      }

      // Fetch staff
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .eq('is_active', true);

      if (staffError) {
        console.error('Staff fetch error:', staffError);
        throw new Error(`Error fetching staff: ${staffError.message}`);
      }

      // Fetch rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .eq('is_active', true);

      if (roomsError) {
        console.error('Rooms fetch error:', roomsError);
        throw new Error(`Error fetching rooms: ${roomsError.message}`);
      }

      const formattedEvents = (bookingsData || []).map((booking: any) => ({
        id: booking.id,
        title: booking.services?.[0]?.name || 'Untitled Booking',
        start: booking.start_time,
        end: booking.end_time,
        status: booking.status,
        description: booking.notes,
        room_id: booking.room_id,
        staff_id: booking.staff_id,
        service_id: booking.service_id,
        customer_id: booking.customer_id
      }));

      setEvents(formattedEvents);
      setServices(servicesData || []);
      setStaff(staffData || []);
      setRooms(roomsData || []);
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching calendar data');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDateSelect(selectInfo: any) {
    if (!user) {
      alert('Please log in to make a booking');
      return;
    }

    setBookingForm({
      ...bookingForm,
      start_time: selectInfo.startStr,
      end_time: selectInfo.endStr
    });
    setIsBookingFormOpen(true);
  }

  async function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            customer_id: user.id,
            service_id: bookingForm.service_id,
            staff_id: bookingForm.staff_id,
            start_time: bookingForm.start_time,
            end_time: bookingForm.end_time,
            status: 'pending',
            notes: bookingForm.notes
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newEvent: CalendarEvent = {
          id: data.id,
          title: services.find(s => s.id === data.service_id)?.name || 'New Booking',
          start: data.start_time,
          end: data.end_time,
          status: data.status,
          description: data.notes,
          service_id: data.service_id,
          staff_id: data.staff_id,
          customer_id: data.customer_id
        };
        setEvents([...events, newEvent]);
        setIsBookingFormOpen(false);
        setBookingForm({
          service_id: '',
          staff_id: '',
          start_time: '',
          end_time: '',
          notes: ''
        });
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Failed to create booking. Please try again.');
    }
  }

  async function handleEventClick(clickInfo: any) {
    const event = events.find(e => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setIsOpen(true);
    }
  }

  async function handleEventDrop(dropInfo: any) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          start_time: dropInfo.event.startStr,
          end_time: dropInfo.event.endStr
        })
        .eq('id', dropInfo.event.id)
        .select();

      if (error) throw error;

      await fetchCalendarData();
    } catch (err) {
      console.error('Error updating booking:', err);
      alert('Failed to update booking. Please try again.');
      dropInfo.revert();
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading calendar...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <>
      <div className="h-screen p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          editable={user?.role === 'admin' || user?.role === 'staff'}
          selectable={!!user}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          height="100%"
        />
      </div>

      {/* Booking Form Dialog */}
      <Transition appear show={isBookingFormOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsBookingFormOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/30" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Create New Booking
                </Dialog.Title>
                <form onSubmit={handleBookingSubmit} className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Service Category</label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={bookingForm.service_id}
                        onChange={(e) => {
                          const service = services.find(s => s.id === e.target.value);
                          if (service) {
                            const endTime = new Date(bookingForm.start_time);
                            endTime.setMinutes(endTime.getMinutes() + service.duration);
                            setBookingForm({
                              ...bookingForm,
                              service_id: e.target.value,
                              end_time: endTime.toISOString()
                            });
                          }
                        }}
                        required
                      >
                        <option value="">Select a service</option>
                        {Array.from(new Set(services.map(s => s.category))).map(category => (
                          <optgroup key={category} label={category}>
                            {services
                              .filter(s => s.category === category)
                              .map((service) => (
                                <option key={service.id} value={service.id}>
                                  {service.name} - ${service.base_price} ({service.duration} min)
                                </option>
                              ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    {bookingForm.service_id && (
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900">Service Details</h4>
                        {(() => {
                          const service = services.find(s => s.id === bookingForm.service_id);
                          return service ? (
                            <div className="mt-2 text-sm text-gray-600">
                              <p className="font-medium">Price: ${service.base_price}</p>
                              <p className="mt-1">{service.description}</p>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Staff Member</label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={bookingForm.staff_id}
                        onChange={(e) => setBookingForm({ ...bookingForm, staff_id: e.target.value })}
                        required
                      >
                        <option value="">Select a staff member</option>
                        {staff.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Appointment Time</label>
                      <div className="mt-1 text-sm text-gray-900">
                        {new Date(bookingForm.start_time).toLocaleString()}
                        {bookingForm.service_id && (
                          <span className="text-gray-500">
                            {" - "}
                            {new Date(bookingForm.end_time).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        rows={3}
                        value={bookingForm.notes}
                        onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                        placeholder="Any special requests or notes..."
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                      onClick={() => setIsBookingFormOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                    >
                      Create Booking
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Event Details Dialog */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/30" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {selectedEvent?.title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Service: {services.find(s => s.id === selectedEvent?.service_id)?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Staff: {staff.find(s => s.id === selectedEvent?.staff_id)?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Start: {new Date(selectedEvent?.start || '').toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    End: {new Date(selectedEvent?.end || '').toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {selectedEvent?.status}
                  </p>
                  {selectedEvent?.description && (
                    <p className="text-sm text-gray-500 mt-2">
                      Notes: {selectedEvent.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                  {(user?.role === 'admin' || user?.role === 'staff') && (
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                      onClick={async () => {
                        if (selectedEvent?.id) {
                          try {
                            const { error } = await supabase
                              .from('bookings')
                              .delete()
                              .eq('id', selectedEvent.id);

                            if (error) throw error;

                            setEvents(events.filter(e => e.id !== selectedEvent.id));
                            setIsOpen(false);
                          } catch (err) {
                            console.error('Error deleting event:', err);
                            alert('Failed to delete event. Please try again.');
                          }
                        }
                      }}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}