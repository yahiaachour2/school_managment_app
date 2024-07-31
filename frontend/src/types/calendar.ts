export interface CalendarEvent {

    start: Date;
    end: Date;
    title: string;
    type: string;
    id?: string ;
    eventType?: string
  }

  export interface ProductFormProps {
    onClose: () => void;
    id?: string ;

    event: CalendarEvent;
    handleCloseModal?:any;
    modalRef?:any;

}


export interface ProductFormProps2 {
    onClose: () => void;
    onSubmit: (calendarevent: CalendarEvent) => Promise<void>;
        event: CalendarEvent;

  }
