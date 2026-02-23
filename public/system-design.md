# System Design Document

Project: Moirai  <br>Version: 1\.0  <br>Author\(s\): Evren Efe BALCI, Fatih Berat BAKIRTAŞ<br>Date: 23\.02\.2026

## 1\. Introduction

### 1\.1 Purpose

This document describes the system architecture, design decisions, and technical structure of the Personal Decision Support Assistant also known as **Moirai** website\.

### 1\.2 Scope

The system is a browser\-based Single Page Application \(SPA\) developed using React\. It enables users to create structured, multi\-criteria decisions and analyze them using weighted scoring, analytical metrics and AI\.

## 2\. System Overview

The application follows a client\-side architecture with external API dependencies\.

High\-Level Architecture:

User  

- React UI Layer
- State Management
- Analytics Engine \(Business Logic\)

## 3\. Architectural Design

### 3\.1 Architectural Pattern

The system follows:

- Component\-based architecture
- Separation of Concerns
- Unidirectional data flow

### 3\.2 Layers

### Presentation Layer

Responsible for:

- User input handling
- Rendering forms and tables
- Displaying analytics results using modern graphs
- Analysis AI

### State Management Layer

Implemented using:

- useReducer
- \[Context API if used\]

Responsible for:

- Managing decisions, criteria, and alternatives

### Business Logic Layer

Contains:

- Weighted scoring algorithm
- Sensitivity analysis
- Stability index calculation
- Impact analysis
- Explainability engine

This layer is UI\-independent and fully testable\.

## 4\. Data Model

### 4\.1 Criteria Table

- id: string
- tableName: string
- createdAt: Date
- criteriaName: string
- ratingScore: number \(1\-10\)

### 4\.2 Operations Table

- id: string
- candidate: string
- criterias\[\]: string
- weight: number \(1–10\)

## 5\. Core Algorithms

### 5\.1 Weighted Scoring Formula

Total Score = Σ \(Criterion Score × Criterion Weight\)

## 6\. Design Decisions

- No backend used to preserve privacy and reduce complexity\.
- Text\-to\-Text LLM\(s\) have been used for Analysis using Open Router API\. 
- Modular folder structure to ensure scalability\.

