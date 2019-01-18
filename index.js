const path = require('path');
const fs = require('fs');
//test//auto up
const settings= "settings";

const sorcerer = "sorc";
const archer = "arch";
const gunner = "gun";

const priest = "priest";
const mystic = "myst";

const lancer = "lanc";
const brawler = "brawl";
const warrior = "war";
const berserker = "zerk";

const ninja = "ninja";
const reaper = "reaper";
const valk = "valk";
const slayer = "slayer";
// COLORS //cr cg cb cdb clb/cy co/ cp clp /cv /cbl cgr cw
const cr = '</font><font color="#ff0000">';//RED
const cg = '</font><font color="#00ff00">';//GREEN
const cdb = '</font><font color="#2727ff">';//DARK BLUE

const cy = '</font><font color="#ffff00">';//YELLOW
const cp = '</font><font color="#ff00ff">';//PINK
const clp = '</font><font color="#ff77ff">';//LIGHT PINK
const clb = '</font><font color="#00ffff">';//LIGHT BLUE

const co = '</font><font color="#ff7700">';//ORANGE
const cb = '</font><font color="#0077ff">';//BLUE
const cv = '</font><font color="#7700ff">';//VIOLET

const cbl = '</font><font color="#000000">';//BLACK
const cgr = '</font><font color="#777777">';//GRAY
const cw = '</font><font color="#ffffff">';//WHITE
//EVENT TYPES
const cstart =0;
const cpress =1;
const crelease =2;

const ld=0;//lanc delay
const lb=20200;
const lba=181100;
const lba2=181101;
const laa=11200;
const laa2=11201;
const laa3=11202;

const { Readable, Writeable } = require('tera-data-parser/lib/protocol/stream');
const ONLY_USER_HOOK = {order: -1000000, filter: {fake: false}};

module.exports = function Macro(dispatch) {
		let lad=50;
		let lbd=90;
		let lpa=false;//pause lancer script by block
		let laDodge=false;//lancer dodge
		let lc=0;
		let eTarget=0;
		let targets;
		let endpoints;
		let fakeS=false;
	//info for funnctions
	let gameId=dispatch.game.me.gameId;
	let model; //used to get player class //can be undefined after Hot-Reload
	let attackSpeed; //attack speed
	let loc = { };
	let xloc; //destination
	let yloc; //destination
	let zloc; //destination
	let w = 0;
	let abnormalityid; //buff/effect
	let target; //Boss id
	
	//For Macro
	let bto = 200; //Bait>Skill timeout
	let timeout = 500;
	let startTime;
	let elapsedTime;
	let skillCastTime; //not used now
	let skillCooldown; //not used now
	let skillInteruptTime;  //not used now //time when you can interrupt skill(from skill start time)
	let canInterupt;  //not used now //can interupt skill with dodge skills?
	let nocooldown = false; //no cooldown
	
	// Config array indexes
	const ROT_OFFSET = 2; //Macro array index Offset
	let cSkillNum = 0; //Current Skill Number
	let cRotNum = 0; //Current Macro Mumber
	let cSkillName = "NoName";
	let cSkillId; //skill id
	let dontDoIt; //for commands
	let j; //Used variable
	let tempName; //Used variable
	let tempStr="";//Used variable
	let isCatch=false; //used to catch id and type of skills
	let catId;
	let catType;
	
	//Arrays
	let time = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //20 time for debug
	let timeid=0;
	
	//Core
	let bait = false; // Default - macro enabled // Not used..
	
	
	//Config
	let config = {};
	try 
	{
		config = require('./config.json');
		if (config["settings"] === undefined || config["settings"] == null)
		{
			config[settings]=[];
		}
		if (config["sorc"] === undefined || config["sorc"] == null)
		{
			config[sorcerer]=[];
			config["r"+sorcerer]=[];
		}
		if (config["arch"] === undefined || config["arch"] == null)
		{
			config[archer]=[];
			config["r"+archer]=[];
		}
		if (config["arch"] === undefined || config["arch"] == null)
		{
			config[gunner]=[];
			config["r"+gunner]=[];
		}
			
		if (config["arch"] === undefined || config["arch"] == null)
		{
			config[priest]=[];
			config["r"+priest]=[];
		}
		if (config["arch"] === undefined || config["arch"] == null)
		{
			config[mystic]=[];
			config["r"+mystic]=[];
		}

		if (config["arch"] === undefined || config["arch"] == null)
		{
			config[lancer]=[];
			config["r"+lancer]=[];
		}
		if (config["arch"] === undefined || config["arch"] == null)
		{
			config[brawler]=[];
			config["r"+brawler]=[];
		}
		if (config["arch"] === undefined || config["arch"] == null)
		{
			config[warrior]=[];
			config["r"+warrior]=[];
		}
		if (config["arch"] === undefined || config["arch"] == null)
		{
			config[berserker]=[];
			config["r"+berserker]=[];
		}

		if (config["arch"] === undefined || config["arch"] == null)
		{
			config[ninja]=[];
			config["r"+ninja]=[];
		}
		if (config["arch"] === undefined || config["arch"] == null)
		{
			config[reaper]=[];
			config["r"+reaper]=[];
		}
		if (config["arch"] === undefined || config["arch"] == null)
		{
			config[valk]=[];
			config["r"+valk]=[];
		}
		if (config["arch"] === undefined || config["arch"] == null)
		{
			config[slayer]=[];
			config["r"+slayer]=[];
		}
		/*
		config["sorc"] ={
			"0": ["skillname", 1]// Skill Number 0 is only for example!
		};*/
	}
	catch(error) //if file not exist this creates new
	{
			config[settings]=[];//settings will be here
		config[sorcerer]=[];
		config["r"+sorcerer]=[];
		config[archer]=[];
		config["r"+archer]=[];
		config[gunner]=[];
		config["r"+gunner]=[];
		
		config[priest]=[];
		config["r"+priest]=[];
		config[mystic]=[];
		config["r"+mystic]=[];

		config[lancer]=[];
		config["r"+lancer]=[];
		config[brawler]=[];
		config["r"+brawler]=[];
		config[warrior]=[];
		config["r"+warrior]=[];
		config[berserker]=[];
		config["r"+berserker]=[];

		config[ninja]=[];
		config["r"+ninja]=[];
		config[reaper]=[];
		config["r"+reaper]=[];
		config[valk]=[];
		config["r"+valk]=[];
		config[slayer]=[];
		config["r"+slayer]=[];
		/*config["sorc"] ={
			"0": ["skillname", 1]
		};*/
		fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify(config, null, 2));
		//fs.writeFile(path.join(__dirname, 'config.json'), JSON.stringify(config, null, '\t'), err => {});
	}
	
	// Settings depend variables
	let cClass = config[settings][0];//"sorc"//Current Class
	let cRot = "r"+config[settings][0]; //Current Macros
	
	let enabled = config[settings][1]; //enable module
	
	//Messages
	let testmode = config[settings][2]; //Enable debug messages			//Always on for now
	let abnorm = config[settings][3]; //abnormalities messages
	
	/*//SETTINGS: Class IS_ENABLED IS_Debug IS_Abnorm
	
		config[class]		[SkillNumber]	[skillAttributes]
			  0=sorc		  0=num1	 	 0=skill skill ID
			  1=sorcMacros	  1=num2		 1=skill Name
				13 classes					 3=skill Type of cast
											 4=skill Priority
											 5=skill This Skill>Next Skill Cast Time	//it's timeout for next skill
											 6=skill CD
		Rotaton[Triggering_Skill_ID, Macro_NAME, TRIGGERING_TYPE, IS_ENDLESS, IS_ENABLED, BODY]
	*/
	
	//XXXXXXXXXX//XXXXXXXXXX//XXXXXXXXXX//XXXXXXXXXX//XXXXXXXXXX//XXXXXXXXXX//XXXXXXXXXX//XXXXXXXXXX//XXXXXXXXXX
	//COMMANDS////COMMANDS////COMMANDS////COMMANDS////COMMANDS////COMMANDS////COMMANDS////COMMANDS////COMMANDS//
	//XXXXXXXXXX//XXXXXXXXXX//XXXXXXXXXX//XXXXXXXXXX//XXXXXXXXXX//XXXXXXXXXX//XXXXXXXXXX//XXXXXXXXXX//XXXXXXXXXX
	
	// Constructive command
	dispatch.command.add('mm', (x, y, z, a, b, c, d) => {
		if(x==undefined){
			enabled = !enabled;say("Macros " + (enabled ? 'Activated':'Deactivated'), "#FF00FF");
			config[settings][1]=(enabled ? true : false);saveConfig();
		}else{
			
			// Commands
			switch (x) {
/*Color Test*/	case 'color':
					say(cr+"\nRED COLOR"+cg+"\nGREEN COLOR"+cdb+"\nDARK BLUE COLOR"+cy+"\nYELLOW COLOR"+cp+"\nPINK COLOR"+clp+"\nLIGHT PINK COLOR"+clb+"\nLIGHT BLUE COLOR"+co+"\nORANGE COLOR"+cb+"\nBLUE COLOR"+cv+"\nVIOLET COLOR"+cbl+"\nBLACK COLOR"+cgr+"\nGRAY COLOR"+cw+"\nWHITE COLOR");
				break;
				case 'time':	// Show time Between 2 events
					if(y==undefined||z==undefined){say(cp+"!mm time "+cy+"[time2] [time1]");break;}
					elapsed(y, z);
				break;
/*Lanc Blk Del*/case 'ss':
					if(y==undefined){say(cp+"!mm ss "+cy+"[skill id]");break;}
					startSkill(y);say(cp+"Trying ss "+cy+y);
				break;
/*Lanc Blk Del*/case 'ps':
					if(y==undefined){say(cp+"!mm ps "+cy+"[skill id]");break;}
					pressSkill(y);say(cp+"Trying ps "+cy+y);
				break;
/*Lanc Blk Del*/case 'fs':
					fakeS = !fakeS;say(cp+"Fake Skills " + (fakeS ? 'Activated':'Deactivated'));
				break;
/*Lanc Blk Del*/case 'lbd':
					if(y==undefined){say(cp+"!mm lbd "+cy+"[delay]");break;}
					lbd=y;say(cp+"Lancer Block delay set to "+cy+lbd);
				break;
/*Lanc AA  Del*/case 'lad':
					if(y==undefined){say(cp+"!mm lad "+cy+"[delay]");break;}
					lad=y;say(cp+"Lancer AutoAttack delay set to "+cy+lad);
				break;
				case 'catch':	// Catch skill id and type
					say("Use skill now", "#00FF00");isCatch=true;
				break;
/*New skill*/	case 'snew': // Add New skill with id=y, name=z
					if(y==undefined||z==undefined||a==undefined){say(cp+"!mm snew"+cy+" [id] [name] [type]"+cb+" [priority=0] [cast time=0] [cd=0]");break;}
					//check: if ID is not already exist
					dontDoIt=false;if(y=="cat")y=catId;if(a=="cat")a=catType;if(b==undefined)b=0;if(c==undefined)c=0;if(d==undefined)d=0;
					if(config[cClass][0]!=undefined && config[cClass][0]!=null) //IF class have atleast 1 skill defined
					{
						for(let i=0;i<config[cClass].length;i++)
						{
							if(config[cClass][i][0]==y){say('Skill with this id already exists in Number \"'+i+'\" Skill, use command !mm sedit instead', "#FF0000");dontDoIt=true;}
						}
					}
					if(!dontDoIt){
						defineConfig1(cClass);
						cSkillNum=config[cClass].length;
						defineConfig2(cClass, cSkillNum);
						
						config[cClass][cSkillNum][0]=y;//ID
						config[cClass][cSkillNum][1]=z;//NAME
						config[cClass][cSkillNum][2]=a;//TYPE
						config[cClass][cSkillNum][3]=b;//Priority
						config[cClass][cSkillNum][4]=c;//Cast Time
						config[cClass][cSkillNum][5]=d;//CD
						say("New: Skill id: "+y+" Name: "+z+", Type: "+a+", Priority: "+b+", Cast Time: "+c+", CD: "+d, "#FF00FF");
						saveConfig();
					}
				break;
/*Edit Skill*/	case 'sedit': // Edit skill with id "y"
					if(y==undefined||z==undefined){say(cp+"!mm sedit "+cy+"[id]"+cb+" [name] [type] [priority] [cast time] [cd] | use [-] to skip argument");break;}
					//check: if ID is not already exist
					dontDoIt=false;if(y=="cat")y=catId;if(a=="cat")a=catType;
					if(config[cClass][0]!=undefined && config[cClass][0]!=null) //IF class have atleast 1 skill defined
					{
						for(let i=0;i<config[cClass].length;i++)
						{
							if(config[cClass][i][0]==y)
							{
								dontDoIt=true;
								defineConfig1(cClass);
								defineConfig2(cClass, i);
								
								if(z!='-')config[cClass][i][1]=z;//NAME
								if(a!='-'&&a!=undefined)config[cClass][i][2]=a;//TYPE
								if(b!='-'&&b!=undefined)config[cClass][i][3]=b;//Priority
								if(c!='-'&&c!=undefined)config[cClass][i][4]=c;//Cast Time
								if(d!='-'&&d!=undefined)config[cClass][i][5]=d;//CD
								
								say("Edit: Skill id: "+y+" Name: "+config[cClass][i][1]+", Type: "+config[cClass][i][2]+", Priority: "+config[cClass][i][3]+", Cast Time: "+config[cClass][i][4]+", CD: "+config[cClass][i][5], "#FF00FF");
								saveConfig();
							}
						}
					}
					if(!dontDoIt)say("Skill with id \""+y+"\" didn't found", "#FF0000");
				break;
/*SkillDelete*/	case 'sdel':	// Delete skill with id "y"
					if(y==undefined){say("!mm sdel [id]", "#FF00FF");break;}
					dontDoIt=false;if(y=="cat")y=catId;
					if(config[cClass][0]!=undefined && config[cClass][0]!=null) //IF class have atleast 1 macro defined
					{
						for(let i=0;i<config[cClass].length;i++)
						{
							if(config[cClass][i][0]==y){dontDoIt=true;
							say('Skill with ID \"'+config[cClass][i][0]+'\" and Name '+config[cClass][i][1]+' was removed', "#FF00FF");
							config[cClass].splice(i,1);
							saveConfig();
							}
						}
					}else{say("No Skills for current Class in config", "#FF0000");}
					if(!dontDoIt)
					{
						say("Skill With ID \""+y+"\" Didn't found", "#FF0000");
					}
				break;//splice(index, howmany, item1, ....., itemX)
/*Skill List*/	case 'slist': // Lists all skills of current Class
					if(config[cClass][0]!=undefined && config[cClass][0]!=null) //IF class have atleast 1 skill defined
					{
						tempStr='List of \"'+config[cClass].length+'\" Skills:';
						for(let i=0;i<config[cClass].length;i++)
						{
							tempStr=tempStr+'\n#'+i+' ID: '+config[cClass][i][0]+', Name: '+config[cClass][i][1]+', Type: '+config[cClass][i][2]+', Priority: '+config[cClass][i][3]+', CastTime: '+config[cClass][i][4]+', CD: '+config[cClass][i][5];
						}
						say(tempStr, "#FF00FF");tempStr="";
					}else{say("No skills for current Class in config", "#FF0000");}
				break;
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
/*New Macro*/	case 'mnew':	// Add New Macro with triggering skill id=y, name=z...
					if(y==undefined||z==undefined||a==undefined){say(cp+"!mm mnew "+cy+"[id] [name] [type(s|p|r|as|ae|esr|abnb|abne|cd)]"+cb+" [isloop=0]");break;}
					dontDoIt=false;if(y=="cat")y=catId;if(a=="cat")a=catType;if(b==undefined)b=0;
					if(config[cRot][0]!=undefined && config[cRot][0]!=null) //IF class have atleast 1 Macro defined
					{
						for(let i=0;i<config[cRot].length;i++)
						{
							if(config[cRot][i][0]==y){say('Attention!: This skill id is already used as Trigger in Macro \"'+config[cRot][i][1]+'\", but still will be created.', "#FF7700");}
							if(config[cRot][i][1]==z){say('Macro with name \"'+z+"\" already exist", "#FF0000");dontDoIt=true;}
						}
					}
					if(!dontDoIt){
						defineConfig1(cRot);
						if(config[cRot][0]!=undefined && config[cRot][0]!=null)cRotNum=config[cRot].length;
						defineConfig2(cRot, cRotNum);
						
						config[cRot][cRotNum][0]=y;//ID
						config[cRot][cRotNum][1]=z;//NAME
						if(isNaN(a)){
							switch (a) {
							case 's':
								config[cRot][cRotNum][2]=cstart;//TYPE
							break;
							case 'p':
								config[cRot][cRotNum][2]=cpress;
							break;
							case 'r':
								config[cRot][cRotNum][2]=crelease;
							break;
							case 'as':
								config[cRot][cRotNum][2]=3;
							break;
							case 'ae':
								config[cRot][cRotNum][2]=4;
							break;
							case 'esr':
								config[cRot][cRotNum][2]=5;
							break;
							case 'abnb':
								config[cRot][cRotNum][2]=6;
							break;
							case 'abne':
								config[cRot][cRotNum][2]=7;
							break;
							case 'cd':
								config[cRot][cRotNum][2]=8;
							break;
							}
						}else{config[cRot][cRotNum][2]=a;}
						config[cRot][cRotNum][3]=parseInt(b);//ISLOOP
						say("New: Macro id: "+y+", Name: "+z+", TriggerType: "+a+(b==1 ? ", Loop" : ", NO Loop"), "#FF00FF");
						saveConfig();
					}
				break;
/*EditMacro*/	case 'medit':	// Edit Macro with name "z"...
					if(y==undefined||z==undefined){say("!mm medit [id] [name] [type(s|p|r|as|ae|esr|abnb|abne|cd)] [isloop] | use [-] to skip argument", "#FF00FF");break;}
					dontDoIt=false;if(y=="cat")y=catId;if(a=="cat")a=catType;
					if(config[cRot][0]!=undefined && config[cRot][0]!=null) //IF class have atleast 1 Macro defined
					{
						for(let i=0;i<config[cRot].length;i++)
						{
							if(config[cRot][i][1]==z)
							{
								dontDoIt=true;
								if(y!='-')config[cRot][i][0]=y;//ID
								if(isNaN(a)){
									if(a!="-" && a!=undefined)
									switch (a) {
									case 's':
										config[cRot][i][2]=cstart;//TYPE
									break;
									case 'p':
										config[cRot][i][2]=cpress;
									break;
									case 'r':
										config[cRot][i][2]=crelease;
									break;
									case 'as':
										config[cRot][i][2]=3;
									break;
									case 'ae':
										config[cRot][i][2]=4;
									break;
									case 'esr':
										config[cRot][i][2]=5;
									break;
									case 'abnb':
										config[cRot][i][2]=6;
									break;
									case 'abne':
										config[cRot][i][2]=7;
									break;
									case 'cd':
										config[cRot][i][2]=8;
									break;
									}
								}else{config[cRot][i][2]=a;}
								if(b!='-'&&b!=undefined)config[cRot][i][3]=b;//ISLOOP
								say("Edit: Macro id: "+config[cRot][i][0]+", Name: "+config[cRot][i][1]+", TriggerType: "+config[cRot][i][2]+(config[cRot][i][3]==1 ? ", Loop" : ", NO Loop"), "#FF00FF");
								saveConfig();
							}
						}
					}
					if(!dontDoIt)
					{
						say("Macro With Name \""+z+"\" Didn't found", "#FF0000");
					}
				break;
/*NameMacro*/	case 'mname':	// Rename Macro with name "y"...
					if(y==undefined||z==undefined){say("!mm mname [old name] [new name]", "#FF00FF");break;}
					dontDoIt=false;
					if(config[cRot][0]!=undefined && config[cRot][0]!=null) //IF class have atleast 1 Macro defined
					{
						for(let i=0;i<config[cRot].length;i++)
						{
							if(config[cRot][i][1]==y)
							{
								dontDoIt=true;
								config[cRot][i][1]=z;//Renaming
								say("Macro with Name: "+y+", Renamed to: "+z, "#FF00FF");
								saveConfig();
							}
						}
					}
					if(!dontDoIt)
					{
						say("Macro With Name \""+y+"\" Didn't found", "#FF0000");
					}
				break;
/*AddToMacro*/	case 'madd':	// Add event to Macro with name "y"
					if(y==undefined||z==undefined||a==undefined||b==undefined){say("!mm madd [name] [type(s|p|r|as|ae|esr|abnb|abne|cd)] [id] [delay]", "#FF00FF");break;}
					dontDoIt=false;if(a=="cat")a=catId;if(z=="cat")z=catType;
					if(config[cRot][0]!=undefined && config[cRot][0]!=null) //IF class have atleast 1 Macro defined
					{
						for(let i=0;i<config[cRot].length;i++)
						{
							if(config[cRot][i][1]==y)//if Name
							{
								j=config[cRot][i].length;
								dontDoIt=true;
								//[Type]:
								//Skill [id, timeout]
								//[0 1 2 3 4]
								
								if(isNaN(z)){
									switch (z) {
									case 's':
										config[cRot][i][j]=0;//TYPE
									break;
									case 'p':
										config[cRot][i][j]=1;
									break;
									case 'r':
										config[cRot][i][j]=2;
									break;
									case 'as':
										config[cRot][i][j]=3;
									break;
									case 'ae':
										config[cRot][i][j]=4;
									break;
									case 'esr':
										config[cRot][i][j]=5;
									break;
									case 'abnb':
										config[cRot][i][j]=6;
									break;
									case 'abne':
										config[cRot][i][j]=7;
									break;
									case 'cd':
										config[cRot][i][j]=8;
									break;
									}
								}else{config[cRot][i][j]=z;}
								config[cRot][i][j+1]=a;//ID
								config[cRot][i][j+2]=b;//Delay
								say("Added: Macro Name: "+y+", Type: "+z+", ID: "+a+", Delay: "+b, "#FF00FF");
								saveConfig();
							}
						}
					}
					if(!dontDoIt)
					{
						say("Macro With Name \""+y+"\" Didn't found", "#FF0000");
					}
				break;
/*EditAddMacro*/case 'maddedit':	// Edit Added event to Macro with name "y"
					if(y==undefined){say("!mm maddedit [name] [type(s|p|r|as|ae|esr|abnb|abne|cd)] [id] [delay] [index] | use [-] to skip argument", "#FF00FF");break;}
					dontDoIt=false;if(a=="cat")a=catId;if(z=="cat")z=catType;
					if(config[cRot][0]!=undefined && config[cRot][0]!=null) //IF class have atleast 1 Macro defined
					{
						for(let i=0;i<config[cRot].length;i++)
						{
							if(config[cRot][i][1]==y)
							{
								if(config[cRot][i][4]!=undefined)// s id 4 nachinaetsya Body
								{
									j=c*3+4;//MODIFY INDEX
									if(config[cRot][i][j]!=undefined)
									{
										if(isNaN(z)){
											switch (z) {
											case 's':
												config[cRot][i][j]=0;//TYPE
											break;
											case 'p':
												config[cRot][i][j]=1;
											break;
											case 'r':
												config[cRot][i][j]=2;
											break;
											case 'as':
												config[cRot][i][j]=3;
											break;
											case 'ae':
												config[cRot][i][j]=4;
											break;
											case 'esr':
												config[cRot][i][j]=5;
											break;
											case 'abnb':
												config[cRot][i][j]=6;
											break;
											case 'abne':
												config[cRot][i][j]=7;
											break;
											case 'cd':
												config[cRot][i][j]=8;
											break;
											case '-':// DIDN'T CHANGED
											break;
										}
										}else{config[cRot][i][j]=z;}
										if(a!='-')config[cRot][i][j+1]=a;//ID
										if(b!='-')config[cRot][i][j+2]=b;//Delay
										say("Index Edited: Macro Name: "+y+", Type: "+config[cRot][i][j]+", ID: "+config[cRot][i][j+1]+", Delay: "+config[cRot][i][j+2], "#FF00FF");
										saveConfig();
									}else{say("Macro With Name \""+y+"\" Doesn't have index \""+c+"\"", "#FF0000");}
								}else{say("Macro With Name \""+y+"\" Doesn't have Body", "#FF0000");}
								dontDoIt=true;
							}
						}
					}
					if(!dontDoIt)
					{
						say("Macro With Name \""+z+"\" Didn't found", "#FF0000");
					}
				break;
/*ListMacro*/	case 'mlist':	// List all macros for current class
					if(config[cRot][0]!=undefined && config[cRot][0]!=null) //IF class have atleast 1 macro defined
					{
						tempStr='List of \"'+config[cRot].length+'\" Macros:';
						for(let i=0;i<config[cRot].length;i++)
						{
							tempName=findName(config[cRot][i][0]);
							tempStr=tempStr+'\n#'+i+' Name: '+config[cRot][i][1]+', Trigger skill: '+(tempName!=0 ? tempName : config[cRot][i][0])+', Trigger type: '+config[cRot][i][2]+', IS Loop: '+config[cRot][i][3];
						}
						say(tempStr, "#FF00FF");tempStr="";
					}else{say("No Macros for current Class in config", "#FF0000");}
				break;
/*MacroDetails*/case 'minfo':	// List details of macro with name "y"
					if(y==undefined){say("!mm minfo [name]", "#FF00FF");break;}
					dontDoIt=false;
					if(config[cRot][0]!=undefined && config[cRot][0]!=null) //IF class have atleast 1 macro defined
					{
						for(let i=0;i<config[cRot].length;i++)
						{
							if(config[cRot][i][1]==y){dontDoIt=true;tempName=findName(config[cRot][i][0]);say('#: '+i+', Name: '+config[cRot][i][1]+', Trigger skill: '+(tempName!=0 ? tempName : config[cRot][i][0])+', Trigger type: '+config[cRot][i][2]+', IS Loop: '+config[cRot][i][3], "#FF00FF");
								for(let p=4;config[cRot][i][p]!=undefined;p+=3)
								{//type id delay
									tempName=findName(config[cRot][i][p+1]);
									tempStr=tempStr+"\n#"+((p-4)/3)+" > w8: "+config[cRot][i][p+2]+" > "+(tempName!=0 ? tempName : config[cRot][i][p+1])+" type: "+config[cRot][i][p];
								}
								if(config[cRot][i][4]!=undefined){say(tempStr, "#FF00FF");tempStr="";}else{say("No Body", "#FF00FF");}
							}
						}
					}else{say("No Macros for current Class in config", "#FF0000");}
					if(!dontDoIt)
					{
						say("Macro With Name \""+y+"\" Didn't found", "#FF0000");
					}
				break;
/*MacroDelete*/	case 'mdel':	// Delete macro with name "y"
					if(y==undefined){say("!mm mdel [name]", "#FF00FF");break;}
					dontDoIt=false;
					if(config[cRot][0]!=undefined && config[cRot][0]!=null) //IF class have atleast 1 macro defined
					{
						for(let i=0;i<config[cRot].length;i++)
						{
							if(config[cRot][i][1]==y){dontDoIt=true;
							say('Macro with Name \"'+config[cRot][i][1]+'\" was removed', "#FF00FF");
							config[cRot].splice(i,1);
							saveConfig();
							}
						}
					}else{say("No Macros for current Class in config", "#FF0000");}
					if(!dontDoIt)
					{
						say("Macro With Name \""+y+"\" Didn't found", "#FF0000");
					}
				break;
/*TEST2*/		case 'get':
					say("config[cClass] = "+config[cClass], "#FF00FF");
					say("config[cClass][x] = " +config[cClass][y], "#FF00FF");
					say("config[cClass][x][y] = "+config[cClass][y][z], "#FF00FF");
				break;
/*MacroDelPart*/case 'madddel':	// Delete macro with name "y" and index "z"
					if(y==undefined||z==undefined){say("!mm madddel [name] [index]", "#FF00FF");break;}
					dontDoIt=false;
					if(config[cRot][0]!=undefined && config[cRot][0]!=null) //IF class have atleast 1 macro defined
					{
						for(let i=0;i<config[cRot].length;i++)
						{
							if(config[cRot][i][1]==y)
							{
								dontDoIt=true;
								if(config[cRot][i][(z*3+4)]!=undefined)
								{
									say('Action at index '+z+' in Macro with Name \"'+config[cRot][i][1]+'\" was removed', "#FF00FF");
									config[cRot][i].splice((z*3+4),3);
									saveConfig();
								}else{say("Didn't found Action at index "+z+' in Macro with Name \"'+config[cRot][i][1]+'\"', "#FF0000");}
							}
						}
					}else{say("No Macros for current Class in config", "#FF0000");}
					if(!dontDoIt)
					{
						say("Macro With Name \""+y+"\" Didn't found", "#FF0000");
					}
				break;//splice(index, howmany, item1, ....., itemX)
/*TEST2*/		case 'get':
					say("config[cClass] = "+config[cClass], "#FF00FF");
					say("config[cClass][x] = " +config[cClass][y], "#FF00FF");
					say("config[cClass][x][y] = "+config[cClass][y][z], "#FF00FF");
				break;
/*Save Config*/	case 'save':
					saveConfig();
					say("Config Saved", "#FF00FF");
				break;
				default:
					say("command mm "+x+" didn't found", "#FF0000");
				break;
			}
		}
	});
	
	dispatch.command.add('macro', (x) => {
		if(x==undefined){//cr cg cb cdb clb/cy co/ cp clp /cv /cbl cgr cw
dispatch.command.message(
cp+"Commands:\n"
+cg+"mm  "+cr+"Mod on/off\n"
+cg+"macro help  "+cr+"instructions\n"
+cg+"macro macro  "+cr+"show Macro commands\n"
+cg+"macro skill  "+cr+"show Skills commands\n"
+cg+"macro debug  "+cr+"Display skill/effects info on/off\n"
+cg+"macro abn  "+cr+"Display Abnormality on/off\n"
+cg+"mm catch  "+cr+"Catch ID and Type of skill\n"
+cg+"mm time "+cp+"[x] [y]  "+cr+"Time = (x - y)"
);
		}else if(x=='skill'){say("only Skills arguments Name and ID is used for displaying Names of skills instead of ID, other arguments currently completly useless and can be set to 0.","#FF0000");
dispatch.command.message(cp+"If you catched skill - type "+cg+"cat "+cp+"instead of ID and Type\n"
+cg+"mm snew "+cy+"[id] [name] [type] [priority] [cast time] [cd]  "+cr+"Write info about skill in config\n"
+cg+"mm sedit "+cy+"[id] [name] [type] [priority] [cast time] [cd]  "+cr+"Edit by ID, use \"-\" to skip arguments\n"
+cg+"mm slist  "+cr+"Lists all skills in config for current class"
);
		}else if(x=='macro'){
dispatch.command.message(
cg+"mm mnew "+cy+"[Triggering skill id] [Name] [Triggering Type] "+cb+"[ISRepeat]  "+cr+"Creates new Macro\n"
+cg+"mm medit "+cy+"[Triggering skill id] [Name] [Triggering Type] [ISRepeat]  "+cr+"Edit by Name, use [-] to skip argument\n"
+cg+"mm mname "+cy+"[old name] [new name]  "+cr+"Rename Macro\n"
+cg+"mm mdel "+cy+"[name]  "+cr+"Delete Macro\n"
+cg+"mm madd "+cy+"[Name] [Triggering Type] [ID] [Delay]  "+cr+"Add Action to Macro\n"
+cg+"mm maddedit "+cy+"[Name] [Triggering Type] [ID] [Delay] [index]  "+cr+"use [-] to skip argument\n"
+cg+"mm madddel "+cy+"[name] [index]  "+cr+"Delete Macro Action at Index\n"
+cg+"mm mlist  "+cr+"Lists all macros in config for current class\n"
+cg+"mm minfo "+cy+"[name]  "+cr+"Show Macro Actions\n"
+cg+"macro mnewinfo "+cr+"mnew arguments info"
);
		}else if(x=='abn'){
			abnorm = !abnorm;say("Abnormality Display: " + (abnorm ? 'Enabled':'Disabled'),"#FF00FF");
			config[settings][3]=(abnorm ? true : false);saveConfig();
		}else if(x=='debug'){
			testmode = !testmode;say("Debug Messages Display: " + (testmode ? 'Enabled':'Disabled'),"#FF00FF");
			config[settings][2]=(testmode ? true : false);saveConfig();
		}else if(x=='info' ||x=='help'){
dispatch.command.message(cp+"How to create macro:\n"
+cp+"1 > "+cg+"Enable Mod(command: "+cr+"!mm"
+cg+")\n"
+cp+"2 > "+cr+"!mm catch "+cg+"Now cast skill you want to use as Macro trigger\n"
+cp+"3 > "+cr+"!mm mnew "+cb+"cat"+co+" Nyan "+cb+"cat\n"
+cg+"Here we Created new Macro with name "+co+"Nyan "+cg+"and with catched("+cb+"cat"+cg+") ID and Type of skill\n"
+cp+"4 > "
+cg+"To get skill cast time - enable skills info - "+cr+"!macro debug\n"
+cp+"5 > "+cg+"Now again cast skill you used as trigger, and after - cast any other skill as fast, as possible\n"
+cp+"6 > "+cg+"You will see message like this:\n"
+cb+"T3: C_START_SKILL... \n"
+cb+"T4: C_START_SKILL... \n"
+cg+"Digits next to T ("+cb+"4 "+cg+"in our example) will be used to get time from 1st to 2nd Skill cast: "+cr+"!mm time "+cy+"[2nd] [1st] (our example: mm time 4 3)\n"
+cp+"7 > "+cg+"Catch 2nd Skill: "+cr+"!mm catch "+cg+"Now use "+cb+"Time"+cg+" you got at "+cp+"step 6 "+cg+"as Delay to Add Action to your Macro: "+cr+"!mm madd "+co+"Nyan"+cb+" (cat)TYPE (cat)ID "+cb+"Time (example: !mm madd Nyan 0 2305648 800)\n"
+cg+"Now try to trigger your skill. If you did all right - you will see 2nd skill Activating. If 2nd hit too early - increace "+cb+"Time"+cg+", or decreace if you want. This way you can add as many Skills as you want and see all things you added by using command "+cr+"!mm minfo "+cg+"and "+cr+"!mm mlist"
);
		}else if(x=='mnewinfo'){
					say("mnew x = skill that trigger Macro\n"+
					"y = Macro Name\n"+
					"z = Triggering Type:\n"+//s p r as ae esr abnb abne cd
					"Arg: s - C_START_SKILL\n"+
					"Arg: p - C_PRESS_SKILL(PRESS)\n"+
					"Arg: r - C_PRESS_SKILL(RELEASE)\n"+
					"Arg: st - C_START_TARGETED_SKILL\n"+
					"Arg: as - S_ACTION_STAGE\n"+
					"Arg: ae - S_ACTION_END\n"+
					"Arg: esr - S_EACH_SKILL_RESULT\n"+
					"Arg: abnb - S_ABNORMALITY_BEGIN\n"+
					"Arg: abne - S_ABNORMALITY_END\n"+
					"Arg: cd - S_START_COOLTIME_SKILL\n"+
					"Arg: s - C_START_SKILL\n"+
					"a = Repeat after end: 0 - no, 1 - yes\n"+
					"Example: !mm mnew 111100 lightstrike s 0\n"
					, "#FF00FF");
		}
	});
																	///////////////////C_START_INSTANCE_SKILL////////////////////////////////S_CANNOT_START_SKILL.4/////////////////////////////////////
	function execute(rot,rnum,indx)
	{
		if(config[rot][rnum][indx]==0) {//TYPE Start
			setTimeout(() => {startSkill(config[rot][rnum][indx+1]);
			if(config[rot][rnum][indx+3]!=undefined){execute(rot,rnum,indx+3);}//continue executing
			},
			config[rot][rnum][indx+2]);//Delay
		}else
		if(config[rot][rnum][indx]==1) {//TYPE Press
			setTimeout(() => {pressSkill(config[rot][rnum][indx+1]);
			if(config[rot][rnum][indx+3]!=undefined){execute(rot,rnum,indx+3);}//continue executing
			},
			config[rot][rnum][indx+2]);//Delay
		}else
		if(config[rot][rnum][indx]==2) {//TYPE Release
			setTimeout(() => {releaseSkill(config[rot][rnum][indx+1]);
			if(config[rot][rnum][indx+3]!=undefined){execute(rot,rnum,indx+3);}//continue executing
			},
			config[rot][rnum][indx+2]);//Delay
		}else
		if(config[rot][rnum][indx]==9) {//TYPE Dash
			setTimeout(() => {targetedSkill(config[rot][rnum][indx+1]);
			if(config[rot][rnum][indx+3]!=undefined){execute(rot,rnum,indx+3);}//continue executing
			},
			config[rot][rnum][indx+2]);//Delay
		}
	}
	
	// Core Event | a=skill ID, b=event type[0=Start,1=Press,2=Release,3=ActionStage,4=ActionEnd,5=EachSkilResu,6=AbnBeg, 7=AbnEnd,8=StartCooldown], c=optional_parameter
	function eve(a, b=undefined, c=undefined)	//Events from Hooks
	{
		if(isCatch){isCatch=false;catId=a;catType=b;say(cb+"cat"+cp+"ched! Id "+cb+a+cp+", Type "+cb+b);}
		if(bait)
		{
			if(a==lb){if(b==2){lpa=false;releaseSkill(lb);lm();say("Macro Lancer try to continue..");
				}else{if(b==1){lpa=true;say("Macro Lancer try to pause..");
			}}}
			for(let i=0;i<config[cRot].length;i++)// i=index rotacii, i[0]=triggering skill
			{
				if(config[cRot][i][0]==a)
				{
					if(config[cRot][i][2]==b)
					{
						if(config[cRot][i][5]!=undefined)
						{
							execute(cRot,i,4);
							
						}
					}
				}
			}
		}
	}
	
	function findName(id){//TO find name of skill
		if(config[cClass][0]!=undefined && config[cClass][0]!=null)
		{
			for(let i=0;i<config[cClass].length;i++)
			{
				if(config[cClass][i][0]==id){return config[cClass][i][1];}
			}
			return 0;
		}else{return 0;}
	}
	
	function setClass(x){
		switch (x) {
//# warrior = 0, lancer = 1, slayer = 2, berserker = 3,
//# sorcerer = 4, archer = 5, priest = 6, mystic = 7,
//# reaper = 8, gunner = 9, brawler = 10, ninja = 11,
//# valkyrie = 12
			case 4:
				forSetClass(sorcerer);
			break;
			case 5:
				forSetClass(archer);
			break;
			case 9:
				forSetClass(gunner);
			break;
			//HEAL
			case 7:
				forSetClass(mystic);
			break;
			case 6:
				forSetClass(priest);
			break;
			//TANK
			case 1:
				forSetClass(lancer);
			break;
			case 10:
				forSetClass(brawler);
			break;
			case 0:
				forSetClass(warrior);
			break;
			case 3:
				forSetClass(berserker);
			break;
			//MEELEE
			case 11:
				forSetClass(ninja);
			break;
			case 8:
				forSetClass(reaper);
			break;
			case 12:
				forSetClass(valk);
			break;
			case 2:
				forSetClass(slayer);
			break;
			default:
				setTimeout(() => {say("Unknown Class, Something Wrong \(O_o)/","#FF0000");
			},15000);//15 sec after login
			break;
		}
		saveConfig();
	}
	function forSetClass(cl){
		cClass=cl;cRot="r"+cl;config[settings][0]=cl;
	}
	//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	//EVENTS////EVENTS////EVENTS////EVENTS////EVENTS////EVENTS////EVENTS////EVENTS////EVENTS////EVENTS////EVENTS//
	//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	
	// Called when item used
	dispatch.hook('C_USE_ITEM', 3, event => {
		if(false && enabled && (event.id==206004 || event.id==206003 || event.id==206002 || event.id==206001 || event.id==206000 || event.id==206005 || event.id==206006 || event.id==206007 || event.id==206008 || event.id==206009))
		{
			if(event.id==206004 || event.id==206003 || event.id==206002 || event.id==206001 || event.id==206000){
				lpa=false;
				bait = !bait;say("Macro " + (bait ? 'Enabled':'Paused'), "#FF00FF");
				if(!bait)lc=0;
				//if(config[settings][0]==lancer)
					setTimeout(() => {lm()},200)
			}else
			if(event.id==206005){// RED WORM BAIT
				if(!lpa){lpa=true;say("Macro Lancer block..");}else
				{lpa=false;releaseSkill(lb);lm();say("Macro Lancer continue..");}
			}else
			if(event.id==206006){// GREEN WORM BAIT
				if(bait){laDodge=true;lpa=true;say("Macro Lancer dodge..");}
				else{startSkill(260100);}
				//setTimeout(() => {laDodge=false;lpa=false;releaseSkill(lb);lm();say("Macro Lancer continue..");},500)
			}
		}
	});
	//block delay: lbd:
	/*
		80 malo dlya bez cdr i s crit etch
		90 - norm
	*/
	// autoattack id=laa 
	//Lancer block barrage Macro
	lbd=90;//block delay
	function lm(){
		if(bait&&(!lpa)&&(!laDodge)){
			startSkill(lba2);
			lc++;
			setTimeout(() => {pressSkill(lb);releaseSkill(lb);if(true){lm()}else//if ----lc<=1
			{
				
				pressSkill(lb);
				lc=0;
			}},lbd)
		}else
		if(lpa&&(!laDodge)){pressSkill(lb)}else
		if(laDodge){startSkill(260100);laDodge=false;bait = false;}
	}
	
	
	
	//Class Test
	function la(){
		if(bait){pressSkill(320100);
			//pressSkill(320100);releaseSkill(320100);
			//setTimeout(() => {la()},lad)
			
			//startSkill(191101);
			lc++;
			setTimeout(() => {//releaseSkill(320100);
			if(true){la()}else//if ----lc<=0
			{
				lc=0;
			}},lad)
		}
	}
	
    dispatch.hook('C_START_COMBO_INSTANT_SKILL', 4, ONLY_USER_HOOK, event => {
		targets=event.targets;
		endpoints=event.endpoints;
		if(enabled){eve(event.skill.id,15);getTime();debug(cg+'T'+timeid+': C_START_COMBO_INSTANT_SKILL(User): ' + event.skill.id);}
    });
	// Called when you start skill
    dispatch.hook('C_START_SKILL', 7, ONLY_USER_HOOK, event => {
		eTarget=event.target;
		if(enabled){if(fakeS){pressSkill(event.skill.id);return false}eve(event.skill.id,0);getTime();debug('T'+timeid+': C_START_SKILL(User): ' + event.skill.id, "#0077FF");}
    });
	
	// Called when you press/release skill
	dispatch.hook('C_PRESS_SKILL', 4, ONLY_USER_HOOK, event => {
		//event.skill.id
		//event.press //true - pressed
		if (enabled){eve(event.skill.id, (event.press ? 1 : 2));	getTime();
			debug('T'+timeid+': C_PRESS_SKILL(User) ' + (event.press ? '\"P\"' : '\"R\"') + ': ' + event.skill.id, "#0077FF");}
	});
	
	
	// Called when????????????????? C_START_TARGETED_SKILL
	dispatch.hook('C_START_TARGETED_SKILL', 6, ONLY_USER_HOOK, event => {
		if(enabled){eve(event.skill.id,9);getTime();debug(cr+'T'+timeid+': C_START_TARGETED_SKILL(User): ' + event.skill.id);}
    });
	// Called when????????????????? C_START_TARGETED_SKILL
	dispatch.hook('C_START_INSTANCE_SKILL', 5, ONLY_USER_HOOK, event => {
		if(enabled){eve(event.skill.id,10);getTime();debug(cr+'T'+timeid+': C_START_INSTANCE_SKILL(User): ' + event.skill.id);}
    });
	// Called when?????????????????
	dispatch.hook('S_CANNOT_START_SKILL', 4, ONLY_USER_HOOK, event => {
		if(enabled){eve(event.skill.id,11);getTime();debug(cr+'T'+timeid+': S_CANNOT_START_SKILL(User): ' + event.skill.id);}
    });
	
	// Called when??? can i use it to disable or fake anything?..
    dispatch.hook('S_ACTION_STAGE', 8, event => { //, {order: -1000000, filter: {fake: null}} //to hook only crafted
        if (!enabled || !(event.gameId == gameId)) return;
		eve(event.skill.id,3); getTime();
		abn('T'+timeid+': S_ACTION_STAGE: ' + event.skill.id, "#00FF00");
		//it's example from op-zerk
       /* if ([SKILL_DEXTER.toString().substring(0, 4), SKILL_SINISTER.toString().substring(0, 4)].includes(event.skill.id.toString().substring(0, 4))) {
            return false;
        }*/
    });
	
	// Called when??? can i use it to disable or fake anything?..
    dispatch.hook('S_ACTION_END', 5, {order: -1000000, filter: {fake: null}}, event => {
        if (!enabled || !(event.gameId == gameId)) return;
		eve(event.skill.id,4); getTime();
		abn('T'+timeid+': S_ACTION_END: ' + event.skill.id, "#00FF00");
		//it's example from op-zerk
        /*if ([SKILL_DEXTER.toString().substring(0, 4), SKILL_SINISTER.toString().substring(0, 4)].includes(event.skill.id.toString().substring(0, 4))) {
            return false;
        }*/
    });
	
	// Called when skill hit target
	//dispatch.hook("S_EACH_SKILL_RESULT", 12, { filter: { fake: null }}, sEachSkillResult);
	dispatch.hook('S_EACH_SKILL_RESULT', 12, (event) => {
		if (!enabled) return;
		eve(event.skill.id,5); getTime();
		abn('T'+timeid+': S_EACH_SKILL_RESULT: ' + event.skill.id + ', target: ' + event.target + ', Owner: ' + ((event.owner==0) ? event.source : event.owner), "#FF0000");
		//skillHit(event.skill);
	})
	
	// Called when Abnormality(buff/effect) BEGIN
    dispatch.hook('S_ABNORMALITY_BEGIN', 3, (event) => {
        if (!enabled || !(event.target == gameId)) return; //return if it's not your abnormality
		eve(event.id,6); getTime();
		abn('T'+timeid+': S_ABNORMALITY_BEGIN: '+event.id, "#FFFF00");
        if (event.id == abnormalityid) {
			
        }
    });
	//Abnorm - Yellow, CodePress - Pink, Hit - Red, Action - Green, UserPress - Blue
	// Called when Abnormality(buff/effect) END
    dispatch.hook('S_ABNORMALITY_END', 1, (event) => {
		if (!enabled || !(event.target == gameId)) return;
		eve(event.id,7); getTime();
		abn('T'+timeid+': S_ABNORMALITY_END: '+event.id, "#FFFF00");
		if(event.id == abnormalityid){
			
		}
	});
	
	// Called when server sends you cooldown info
	dispatch.hook('S_START_COOLTIME_SKILL', 3, (event)=>{ 
		if(enabled)
		{
			eve(event.skill.id,8);	//CHANGE IT LATER!!
			if(nocooldown){
				//event.skillid
				event.cooldown=0;return true; //disable client cd
			}
		}
	});
	
	//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	//GETTING INFO////GETTING INFO////GETTING INFO////GETTING INFO////GETTING INFO////GETTING INFO////GETTING INFO//
	//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	
	// AttackSpeed, HP
    dispatch.hook('S_PLAYER_STAT_UPDATE', 10, ONLY_USER_HOOK, event => {
        attackSpeed = (event.attackSpeed + event.attackSpeedBonus) / event.attackSpeed;
        if (event.hp == 0) {
			//when you are dead
        }
    });
	// Location, Destination, Where you look
	dispatch.hook('C_PLAYER_LOCATION', 5, ONLY_USER_HOOK, event => {
        xloc = event.dest.x;
        yloc = event.dest.y;
        zloc = event.dest.z;
		loc = event.loc;
		w = event.w;
	});
	// GameId, Class
	
    dispatch.hook('S_LOGIN', 10, ONLY_USER_HOOK, event => {
        model = event.templateId;//used to get player class
		setClass((model - 10101) % 100);
    });
	
	//###################################################################################################################
	//FUNCTIONS////FUNCTIONS////FUNCTIONS////FUNCTIONS////FUNCTIONS////FUNCTIONS////FUNCTIONS////FUNCTIONS////FUNCTIONS//
	//###################################################################################################################
	
	function comboSkill(argskillid,targ=0) {
		getTime();
		dispatch.toServer('C_START_COMBO_INSTANT_SKILL', 4, {
			skill: { reserved: 0, npc: false, type: 1, huntingZoneId: 0, id: argskillid },
			loc: loc,
			w: w,
			targets: targets,
			endpoints: endpoints
		});
		debug('T'+timeid+': C_START_COMBO_INSTANT_SKILL(Code): ' + argskillid, "#FF00FF");
	}
	// For 1-hit skills
	function startSkill(argskillid, targ=0) {
		getTime();
		dispatch.toServer('C_START_SKILL', 7, {
			skill: { reserved: 0, npc: false, type: 1, huntingZoneId: 0, id: argskillid },
			loc: loc,
			w: w,
			dest: { x: 0, y: 0, z: 0 },
			unk: true,
			moving: false,
			target: targ, //{ low: 0, high: 0, unsigned: true },
			unk2: false
		});
		debug('T'+timeid+': C_START_SKILL(Code): ' + argskillid, "#FF00FF");
	}
	// Press Skill
	function pressSkill(argskillid) { //press block/charge/lockon skills
		getTime();
		dispatch.toServer('C_PRESS_SKILL', 4, {
			skill: { reserved: 0, npc: false, type: 1, huntingZoneId: 0, id: argskillid },
			press: true,
			loc: loc,
			w: w
		});
		debug('T'+timeid+': C_PRESS_SKILL(Code) \"P\": ' + argskillid, "#FF00FF");
	}
	// Release Skill
	function releaseSkill(argskillid) { //release block/charge/lockon skills
		getTime();
		dispatch.toServer('C_PRESS_SKILL', 4, {
			skill: { reserved: 0, npc: false, type: 1, huntingZoneId: 0, id: argskillid },
			press: false,
			loc: loc,
			w: w
		});
		debug('T'+timeid+': C_PRESS_SKILL(Code) \"R\": ' + argskillid, "#FF00FF");
	}
	//antoher type of skills
	function targetedSkill(argskillid) { //DASH like skills
		getTime();
		dispatch.toServer('C_START_TARGETED_SKILL', 6, {
			skill: { reserved: 0, npc: false, type: 1, huntingZoneId: 0, id: argskillid },
			loc: loc,
			w: w,
			dest: loc,
			targets: {id: "0", unk:0}
		});
		debug('T'+timeid+': C_START_TARGETED_SKILL(Code): ' + argskillid, "#FF00FF");
	}
	
	// Time calculation
	function getTime() {
		timeid++;if(timeid>=20)timeid=0;
		time[timeid] = new Date().getTime();
	}
	
	function elapsed(t1, t2) {
		if(t1 >= 0 && t1 <=19 && t2 >= 0 && t2 <=19 ){
			elapsedTime = time[t1] -  time[t2];
			dispatch.command.message("Time: T" + t1 + ' - ' + 'T' + t2 + ' = ' + elapsedTime);
		}else{say('Make sure time1 and time2 >=0 and <=19', "#FF0000")}
	}
	
	// Messages
	function say(msg, color="#ffffff") {
		dispatch.command.message('<font color="' + color + '">' + msg + '</font>');
	}
	
	function debug(msg, color="#ffffff") {
		if(testmode) dispatch.command.message('<font color="' + color + '">' + msg + '</font>');
	}
	function abn(msg, color="#ffffff") {
		if(abnorm) dispatch.command.message('<font color="' + color + '">' + msg + '</font>');
	}
	
	
	// Save Config
	function saveConfig() {
		fs.writeFile(path.join(__dirname, 'config.json'), JSON.stringify(config, null, '\t'), err => {});
	}
	
	// Define Config1//  (class/Macro)
	function defineConfig1(cCl){
		if(config[cCl]==undefined||config[cCl]==null){config[cCl] =[];} //{"0": ["skillname", 1]}
	}
	// Define Config2//  (Skill/Macro Number)
	function defineConfig2(cCl, num){
		if(config[cCl][num]==undefined||config[cCl][num]==null){config[cCl][num]=[];}
	}
	// Reload Config
	function reloadConfig(){
		delete require.cache[require.resolve("./config.js")];
		Object.assign(config, require("./config.js"));
		say("Configuration file has been reloaded", "#ff00ff");
	}
	
	this.destructor = function() {
		dispatch.command.remove('mm');
		dispatch.command.remove('macro');
		delete require.cache[require.resolve('./config.json')];//   ./_config.json
	}
}
