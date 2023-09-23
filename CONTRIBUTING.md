# Contributing to dsa30

Welcome to the DSA30 project! We appreciate your interest in contributing to our platform. This document provides guidelines and information on how you can contribute effectively to the project. Before you start, please make sure to read and follow these guidelines.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Templates](#templates)
    - [chapter-page.mdx](#chapter-pagemdx)
    - [image.mdx](#imagemdx)
    - [practice-question.mdx](#practice-questionmdx)
4. [Components](#components)
    - [ShowHideGif.jsx](#showhidegifjsx)
    - [ShowHideSolution.mdx](#showhidesolutionmdx)
5. [Folder Structure](#folder-structure)
6. [Contributing Guidelines](#contributing-guidelines)
7. [License](#license)

## Introduction

**DSA-30** is a platform for learning Data Structures and Algorithms (DSA) in a fun and structured way. To contribute effectively, you should understand how to use templates and components provided in this project.

## Getting Started

Before you start contributing, ensure you have the following set up:

-   Node.js and npm installed on your local machine.

## Templates

### chapter-page.mdx

This template is used to display the main text content to the user on the website for any chapter. You can create new chapters using this template.

### image.mdx

This template is used when you want to display images on the website.

### practice-question.mdx

This template is used when you want to show a question on the website along with code, explanation, and time complexity analysis for various approaches.

## Components

### ShowHideGif.jsx

This component allows you to display GIFs with a toggle for play/pause.

**Usage**:

```jsx copy
import { ShowHideGif } from "../components/ShowHideGif";

<ShowHideGif
    gifUrl="/path/to/your/gif.gif"
    pausedGifUrl="/path/to/your/paused.gif"
/>;
```

### ShowHideSolution.mdx

This component allows you to hide and show solutions to problems.

**Usage**:

```jsx copy
import { ShowHideSolution } from "../components/ShowHideSolution";

<ShowHideSolution>
    Your solution content goes here(mdx format allowed).
</ShowHideSolution>;
```

## Folder Structure

To ensure that Nextra understands and interprets the file structure correctly, each new chapter folder must have a `meta.json` file. The `meta.json` file should have the following structure:

```json copy
{
    "index": "TODO",
    "introduction": "Introduction",
    "practice_questions": "Practice Questions"
}
```

You are free to update this file as needed, but this structure helps Nextra navigate the content properly.

## Contributing Guidelines

-   Fork the repository to your own GitHub account.
-   Create a new branch for your changes (`git checkout -b feature/new-feature`).
-   Make your changes and ensure that they are well-documented.
-   Test your changes locally.
-   Commit your changes with meaningful commit messages.
-   Push your changes to your forked repository.
-   Create a pull request to the main repository.

Please refer to our [Contributing Guidelines](CONTRIBUTING.md) for more detailed information.

## License

This project is open-source and released under the [MIT License](LICENSE.md). By contributing to this project, you agree to abide by the terms and conditions specified in the license.

Thank you for your contributions to DSA-30! We appreciate your support in making DSA education accessible and enjoyable for users.

Happy contributing! 🎉
