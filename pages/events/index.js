import Layout from "../../components/layout";
import EventCard from "../../components/eventcard";
import { useUser } from "../../lib/hooks";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../store/features/events/eventSlice";

const UserHome = () => {
  const user = useUser({ redirectTo: "/" });
  const { events, loading, error } = useSelector((state) => state.events);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (events && events.length > 0) return;

    dispatch(fetchEvents());
  }, [dispatch]);

  if (!user || user.role !== "user") {
    return null;
  }

  const filteredEvents = events
    .filter((event) => {
      const eventDate = new Date(event.eventDate);
      const start = startDate ? new Date(startDate) : new Date("1970-01-01");
      const end = endDate ? new Date(endDate) : new Date("2999-12-31");
      return eventDate >= start && eventDate <= end;
    })
    .filter((event) =>
      searchTerm
        ? event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

  return (
    <Layout>
      <h1>Available Events</h1>

      <div className="search-and-filter">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          placeholder="Start date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="End date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <EventCard itemList={filteredEvents} />

      <style jsx>{`
        h1 {
          font-size: 2.2rem;
          color: #333;
          font-weight: 600;
          margin-bottom: 2rem;
        }
        .search-bar {
          margin-bottom: 1rem;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 1rem;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .search-and-filter {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        @media (max-width: 600px) {
          h1 {
            font-size: 1.8rem;
          }
          .search-and-filter {
            flex-direction: column;
            align-items: center;
          }
          .search-and-filter input {
            margin-bottom: 0.5rem;
          }
          input {
            width: 80%;
            min-width: 300px;
          }
        }
      `}</style>
    </Layout>
  );
};

export default UserHome;
