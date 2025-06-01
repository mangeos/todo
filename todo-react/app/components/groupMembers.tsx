import React from "react";
import { useEffect } from "react";

type Member = {
  name: string;
};

interface GroupMembersProps {
  groupname: string;
}

const GroupMembers: React.FC<GroupMembersProps> = ({ groupname }) => {
  const [members, setMembers] = React.useState<Member[]>([]);

  useEffect(() => {
    fetchMembers();
  }, [groupname]); // Lägg till groupname som beroende för att hämta medlemmar när den ändras

  const fetchMembers = () => {
    const token = localStorage.getItem("jwt");

    fetch(`http://localhost:8080/groupmembers/${groupname}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Här är förändringen
        const members = data.members.map((name: string) => ({ name }));
        setMembers(members);
      })
      .catch((error) => console.error("Error fetching members:", error));
  };

  return (
    <div>
      <h2>
        <strong>Group Members</strong>
      </h2>
      <ul>
        {members.map((member) => (
          <li key={member.name}>{member.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GroupMembers;
