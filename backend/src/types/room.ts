export enum RoomStatus {
  Available = "Available",
  Occupied = "Occupied",
  UnderMaintenance = "Under Maintenance",
  Reserved = "Reserved",
  Cleaning = "Cleaning",
  Closed = "Closed",
}

export interface CreateRoomInput {
  id: string;
  name: string;
  status: RoomStatus;
  number: string;
  schoolId: string;
}


export interface GetRoomInput {
    id : string
}

export interface updateRoomInput {
    id: string;
    name: string;
    status: RoomStatus;
    number: string;
    schoolId: string;
}

export interface deleteRoomInput {
    id : string
}