package com.example.practice.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "sales_items")
public class SalesItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private int id;

    // 🔥 Many items → one sale
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "Sale_ID")
    private Sale sale;

    // 🔥 Many items → one product

    @ManyToOne
    @JoinColumn(name = "Product_ID")
    private Product product;

    @Column(name = "Quantity")
    private int quantity;

    @Column(name = "Amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    // Default Constructor
    public SalesItem() {}

    // Parameterized Constructor
    public SalesItem(Sale sale, Product product, int quantity, BigDecimal amount) {
        this.sale = sale;
        this.product = product;
        this.quantity = quantity;
        this.amount = amount;
    }

    // Getters & Setters

    public int getId() {
        return id;
    }

    public Sale getSale() {
        return sale;
    }

    public void setSale(Sale sale) {
        this.sale = sale;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
