package com.example.practice.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Sale_ID")
    private int saleId;

    @Column(name = "Sale_Date")
    private LocalDate saleDate;

    @Column(name = "Sale_Time", columnDefinition = "TIME")
    private LocalTime saleTime;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SalesItem> items;

    public Sale() {}

    public Sale(LocalDate saleDate) {
        this.saleDate = saleDate;
    }

    public int getSaleId() { return saleId; }

    public LocalDate getSaleDate() { return saleDate; }
    public void setSaleDate(LocalDate saleDate) { this.saleDate = saleDate; }

    public LocalTime getSaleTime() { return saleTime; }
    public void setSaleTime(LocalTime saleTime) { this.saleTime = saleTime; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public List<SalesItem> getItems() { return items; }
    public void setItems(List<SalesItem> items) { this.items = items; }
}
