name: Pull request
description: Create a pull request
title: "[PR]: "
labels: ["pull request"]
body:
  - type: markdown
    attributes:
      value: |
        ## Summary
        <!-- What does this PR do? -->
  - type: checkboxes
    id: checklist
    attributes:
      label: Checklist
      options:
        - label: Tests pass (`pnpm test`)
          required: false
        - label: No secrets or live Drop answers in this PR
          required: true
        - label: Docs updated if behavior changed
          required: false
