extern crate cmdparser;

use cmdparser::Parser;
use log::trace;
use log::{error, LevelFilter};
use rustyline::error::ReadlineError;
use rustyline::Editor;
use std::fs;
use green_copper_runtime::moduleloaders::{HttpModuleLoader, FileSystemModuleLoader};
use quickjs_runtime::esruntime::EsRuntime;
use green_copper_runtime::fetch::fetch_response_provider;
use quickjs_runtime::esscript::EsScript;
use quickjs_runtime::quickjs_utils::modules::detect_module;

fn main() {

    let (arguments, flags) = Parser::new().merge_values(true).parse();

    if flags.contains(&"v".to_string()) {
        simple_logger::SimpleLogger::new()
            .with_module_level("quickjs_runtime::features::console", LevelFilter::max())
            .with_module_level("ureq::unit", LevelFilter::Error)
            .with_level(LevelFilter::Trace)
            .init()
            .unwrap();
    } else {
        simple_logger::SimpleLogger::new()
            .with_level(LevelFilter::Info)
            .with_module_level("quickjs_runtime::features::console", LevelFilter::max())
            .with_module_level("ureq::unit", LevelFilter::Error)
            .init()
            .unwrap();
    }

    let fsl = FileSystemModuleLoader::new("./");
    let wsl = HttpModuleLoader::new()
        .validate_content_type(false)
        .secure_only();

    let rt = green_copper_runtime::new_greco_rt_builder()
        .fetch_response_provider(fetch_response_provider)
        .script_module_loader(Box::new(fsl))
        .script_module_loader(Box::new(wsl))
        .build();

    let f_opt = arguments.get("f");
    if let Some(f) = f_opt {
        for file_name_string in f {
            let read_res = fs::read_to_string(&file_name_string);
            if read_res.is_ok() {
                let contents = read_res.ok().unwrap();
                trace!("evaluating: {}", contents);
                let is_module = detect_module(contents.as_str());

                let res = match is_module {
                    true => {
                        rt.eval_module_sync(EsScript::new(format!("file:///{}", file_name_string.as_str()).as_str(), contents.as_str()))
                    }
                    false => {
                        rt.eval_sync(EsScript::new(format!("file:///{}", file_name_string.as_str()).as_str(), contents.as_str()))
                    }
                };

                if res.is_err() {
                    error!("error during eval: {}", res.err().unwrap());
                }
            } else {
                error!("could not read file {}", read_res.err().unwrap());
            }
        }
    } else {
        println!("no files to run specified, use -f filename");
    }

    if flags.contains(&"i".to_string()) {
        interactive_mode(&rt);
    }
}

fn interactive_mode(rt: &EsRuntime) {
    println!("press CTRL-D or CTRL-C to exit GreCo...");

    let mut rl = Editor::<()>::new();
    if rl.load_history("greco_history.txt").is_err() {
        // println!("No previous history.");
    }

    loop {
        let readline = rl.readline(">> ");
        match readline {
            Ok(line) => {
                rl.add_history_entry(line.as_str());

                let res = rt.eval_sync(EsScript::new("input.es", line.as_str()));
                match res {
                    Ok(esvf) => {
                        println!("{:?}", esvf);
                    }
                    Err(e) => {
                        println!("{}", e);
                    }
                }
            }
            Err(ReadlineError::Interrupted) => {
                println!("CTRL-C");
                break;
            }
            Err(ReadlineError::Eof) => {
                println!("CTRL-D");
                break;
            }
            Err(err) => {
                println!("Error: {:?}", err);
                break;
            }
        }
    }
    rl.save_history("greco_history.txt").unwrap();
}

#[cfg(test)]
pub mod tests {
    #[test]
    fn test_cmd() {
        // todo refactor main so we can also start with args from scripts
        assert_eq!(1, 1);
    }
}
