<div align="center"><strong>ASFG</strong></div>
<div align="center">Auto Structured Folder Generator</div>
<br />

## ⭐ Introduction

If you have a large number of folders that need to be created for frequent repetition or conventions, this extension can be useful to auto-completed folder structures and files based on pre-determined settings.

## ⭐ Functions

`1. Generate structure from a command palette`

```
1. cmd + shift + p
2. Input 'asfg' and press 'enter'
3. Select structure you want to make
```

`2. Generate structure on a specific folder`

```
1. Right click on a target folder
2. Click asfg context menu
3. Select structure you want to make
```

`3. Register a code snippet and Apply`

```
// 1. Register
1. Drag the target code block + right click
2. Choose "(asfg) register snippet"
3. Input the snippet name

// 2. Apply
1. Left click the postion you want to place the snippet (make cursor) + right click
2. Choose "(asfg) apply snippet"
3. Select the snippet you want to apply
```

<br/>

## ⭐ Configuration

This extension works based on a custom configuration.

There are two cases you could meet when you use this extension.

---

## ⭐ Extra Description For "ASFG"

#### `Case 1 : if there is no asfg.config folder`

<br>

<img src="https://raw.githubusercontent.com/chltjdrhd777/image-hosting/main/no-config-asfg.png" width="503px" height="155px"/>

<br>
If there is no "asfg.config" folder on the workspace root and when you input the "asfg" command on the command palette, you have the two options.

<br/>

1. _"make exmaple folder structure"_ : this option create a sample structure.
2. _"make example config"_ : this option create a sample **asfg.config** folder that stores a custom folder structure shape.

> 😉 if you select the _"make example config"_ option, it would add ignore sentence for asfg.config folder automatically<br/><br/><img src="https://raw.githubusercontent.com/chltjdrhd777/image-hosting/main/auto-git-ignore.png" width="503px" height="155px"/>

---

#### `Case 2 : if asfg.config folder exists`

If there is a **"asfg.config"** folder, it collects structure definitions from a "config.json" file inside **"asfg.config"** folder. It means the json key becomes a select menue. <br/>
Here is an example result if you make config setting required.

<img src="https://raw.githubusercontent.com/chltjdrhd777/image-hosting/main/asfg-json.png" width="303px" height="155px"/><br/>
<img src="https://raw.githubusercontent.com/chltjdrhd777/image-hosting/main/asfg-config-json5.png" width="603px" height="555px"/><br/>
<img src="https://raw.githubusercontent.com/chltjdrhd777/image-hosting/main/asfg-config-json4.png" width="603px" height="155px"/>

<br/>

As you expected if you select the one, our **"asfg"** will generate folder structure accoring to the definition you write in the config.json.

> ⚠️ Note!<br/> _source_ and _destination_ are a relative path started from **"asfg.config"** folder. It means that **asfg** will find a source structure from "path/to/you/project/asfg.config/{target source folder name}" and so is definition.

> But if your creation is started from "specific target folder", **"asfg"** will destine the definition started from that folder.
> For example, if you right-click the "components" folder and select **"asfg"**, it means that the destniation path is **"parent/directory/components/{your destination path}"** like below<br/> <img src="https://raw.githubusercontent.com/chltjdrhd777/image-hosting/main/asfg-config-rightclick-case.png" width="603px" height="555px"/>

---

### `case 3 : Create structure starting from a particular folder`

As you can see above, maybe you hope to create your own structure not from a root workspace but from a folder you choose. If so, you can use **asfg context menu** by right click. <br/>
The only thing you have to do is hover your cursor, right click, and click **asfg** context menu. Then **asfg** will open the select menu and if choose one, it generate structure based on the folder you choose.

<img src="https://raw.githubusercontent.com/chltjdrhd777/image-hosting/main/asfg-config-rightclick.png" width="353px" height="155px"/>

---

## ⭐ Extra Description For "Snippet"

this functionality is very simple. Just block the code, register name, and apply that<br/><br/>
<img src="https://raw.githubusercontent.com/chltjdrhd777/image-hosting/main/asfg-snippet-1.png" width="553px" height="155px"/><br/><br/>
<img src="https://raw.githubusercontent.com/chltjdrhd777/image-hosting/main/asfg-snippet-2.png" width="653px" height="155px"/><br/><br/>
<img src="https://raw.githubusercontent.com/chltjdrhd777/image-hosting/main/asfg-snippet-3.png" width="553px" height="155px"/>
