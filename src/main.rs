extern crate cmdparser;

use cmdparser::Parser;
use log::trace;
use log::{error, LevelFilter};
use quickjs_runtime::esscript::EsScript;
use rustyline::error::ReadlineError;
use rustyline::Editor;
use std::fs;

fn main() {
    //simple_logger::init().unwrap();
    let (arguments, flags) = Parser::new().merge_values(true).parse();

    if flags.contains(&"v".to_string()) {
        simple_logger::SimpleLogger::new()
            .with_level(LevelFilter::Trace)
            .init()
            .unwrap();
    } else {
        simple_logger::SimpleLogger::new()
            .with_level(LevelFilter::Info)
            .with_module_level("ureq::unit", LevelFilter::Error)
            .init()
            .unwrap();
    }

    let m_loader = MultiScriptLoader::new()
        .add(FileScriptLoader::new("./scripts"))
        .add(WebScriptLoader::new());

    let prt = ParallelRuntimeBuilder::new()
        .thread_count(1)
        .script_loader(m_loader)
        .build();

    let f_opt = arguments.get("f");
    if let Some(f) = f_opt {
        for file_name_string in f {
            let read_res = fs::read_to_string(&file_name_string);
            if read_res.is_ok() {
                let contents = read_res.ok().unwrap();
                trace!("evaluating: {}", contents);
                let res =
                    prt.eval_module_sync(EsScript::new(file_name_string.as_str(), contents.as_str()));
                if res.is_err() {
                    error!("error in eval_module_sync: {}", res.err().unwrap());
                }
            } else {
                error!("could not read file {}", read_res.err().unwrap());
            }
        }
    } else {
        println!("no files to run specified, use -f filename");
    }

    if flags.contains(&"i".to_string()) {
        interactive_mode(&prt);
    }
}

fn interactive_mode(prt: &ParallelRuntime) {
    println!("press CTRL-D or CTRL-C to exit GreCo...");

    let mut rl = Editor::<()>::new();
    if rl.load_history("history.txt").is_err() {
        // println!("No previous history.");
    }

    loop {
        let readline = rl.readline(">> ");
        match readline {
            Ok(line) => {
                rl.add_history_entry(line.as_str());

                let res = prt.eval_sync(EsScript::new("input.es", line.as_str()));
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
    rl.save_history("history.txt").unwrap();
}

#[cfg(test)]
pub mod tests {
    #[test]
    fn test_cmd() {
        // todo refactor main so we can also start with args from test
        assert_eq!(1, 1);
    }
}
