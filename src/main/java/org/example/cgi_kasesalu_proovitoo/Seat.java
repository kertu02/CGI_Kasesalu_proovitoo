package org.example.cgi_kasesalu_proovitoo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean availability;
    private int rowNr;
    private int columnNr;

    public Seat(){
    }


    public Seat(boolean availability, int rowNr, int columnNr){
        this.availability = availability;
        this.rowNr = rowNr;
        this.columnNr = columnNr;
    }

    public boolean isAvailability() {
        return availability;
    }

    public void setAvailability(boolean availability) {
        this.availability = availability;
    }

    public int getRowNr() {
        return rowNr;
    }

    public void setRowNr(int rowNr) {
        this.rowNr = rowNr;
    }

    public int getColumnNr() {
        return columnNr;
    }

    public void setColumnNr(int columnNr) {
        this.columnNr = columnNr;
    }
}
