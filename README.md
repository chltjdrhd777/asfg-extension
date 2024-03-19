<div align="center"><strong>ASFG</strong></div>
<div align="center">Auto Structured Folder Generator</div>
<br />

## ⭐ Introduction

If you have a large number of folders that need to be created for frequent repetition or conventions, this extension can be useful to autocomplete folder structures and files based on predetermined settings.

## ⭐ How to use

```
1. cmd + shift + p
2. input 'asfg' and press 'enter'
3. select structure you want to make
```

<br/>

## ⭐ Configuration

This extension works based on a custom configuration.

There are two cases you could meet when you use this extension.

---

`case 1 : No asfg.config`
<br>

<img src="https://raw.githubusercontent.com/chltjdrhd777/image-hosting/main/no-config-asfg.png" width="503px" height="155px"/>

<br>
If there is no "asfg.config" folder on the workspace root and when you input the "asfg" command on the command palette, you have the two options.

<br/>

1. _"make exmaple folder structure"_ : this option create a sample structure.
2. _"make example config"_ : this option create a sample **asfg.config** folder that stores a custom folder structure shape.

> 😉 if you select the _"make example config"_ option, it would add ignore sentence for asfg.config folder automatically<br/><br/><img src="https://raw.githubusercontent.com/chltjdrhd777/image-hosting/main/auto-git-ignore.png" width="503px" height="155px"/>

---

`case 2 : asfg.config exists`

If there is a **"asfg.config"** folder, it collects structure definitions from a "config.json" file inside **"asfg.config"** folder. It means the json key becomes a select menue. <br/>
Here is an example result if you make config setting required.

<img src="https://raw.githubusercontent.com/chltjdrhd777/image-hosting/main/asfg-config-json3.png" width="703px" height="555px"/>
<img src="https://raw.githubusercontent.com/chltjdrhd777/image-hosting/main/asfg-config-json4.png" width="703px" height="155px"/>

<br/>

As you expected, if you select the one, **"asfg"** will generate folder structure accoring to the definition you write in the config.json.

> ⚠️ Note!<br/> _source_ and _destination_ are a relative path started from **"asfg.config"** folder. It means that **asfg** will find a source structure from "... asfg.config/{target source folder name}" and so is definition.
