# Statamic Group Fieldtype

The group fieldtype provides you with a simple way to structure fields into groups in the control panel.

## Why?

The group field gives you an easy way to organise fields in the control panel – including single use groupings, such as a page banner – without having to resort to abusing the grid fieldtype to achieve a similar result.

It also brings a number of benefits to your data, including being able to key fields, so you can re-use the same fields over and over again, without naming conflicts. This is possible because the group field uses both the parent and the child field names when saving and loading values. For example, a group called 'Banner', with a child field called 'Heading' will be saved as:

```
banner:
  heading: This is a heading
```

You would then access it using dot notation: e.g. `banner.heading`

## Installation

To install this addon, download the files from the Statamic Marketplace and place the `Group` folder in your `site/addons` directory. The Group fieldtype will be available immediately.

## How to Use

### Set Up

1. Define the fieldset that you want to include in the group, and save it. _I strongly recommend you set that fieldset to hidden so that users don't get confused when creating new pages._
2. Select the Group fieldtype from the selector when building the fieldset you want to use it in.
3. In `Extras`, select the fieldset you created in step 1.
4. Save the fieldset.

### Accessing data

Let's say you've created a fieldset (in step 1), called Banner. Inside this fieldset are three fields:

```
fields:
  background:
    container: main
    folder: backgrounds
    restrict: true
    max_files: 1
    mode: list
    type: assets
    display: Background
  heading:
    type: text
    display: Heading
    instructions: 'This field is optional. If you fill it out, it will replace the page title in the banner. Otherwise, we''ll use the page title.'
  standfirst:
    type: textarea
    display: Standfirst
```

You enter content through the Group fieldset.

```
fields:
  banner:
    child_fieldset: banner
    type: group
    display: Banner
```

This results in content being saved like so:

```
banner:
  background:
    - /path/to/asset.jpg
  heading: This is a heading
  standfirst: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean in felis sit amet mi eleifend tempus vitae a enim.
```

## Known Issues


## Thanks
Special thanks to [Andrew Haine](https://github.com/AndrewHaine), whose Accordion Group fieldtype helped guide the approach to this addon.
