import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { routes } from "../routes";
import axios from "axios";
import { Conversation } from "../interfaces";
import { Link } from "react-router-dom";

export default function AgentDashboard() {
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(routes.conversation.getAll());
        if (response.status === 200) {
          const data = await response.data;

          // Transform dictionary of conversations to array of conversations
          const conversations: Conversation[] = Object.keys(data).map(
            (key) => data[key]
          );
          setAllConversations(conversations);
        }
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch all conversations every 5 seconds
    fetchConversations();

    const interval = setInterval(() => {
      fetchConversations();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>updated_at</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Conversation UUID</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Open</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {allConversations.map((conversation, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {/* Format the date time */}
                {new Date(conversation.updated_at).toLocaleString()}
              </TableCell>
              <TableCell>{conversation.conversation_uuid}</TableCell>
              <TableCell>
                <Link to={`/agent/chat/${conversation.conversation_uuid}`}>
                  Open
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
