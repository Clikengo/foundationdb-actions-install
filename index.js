const core = require('@actions/core');
const os = require('os');
const { execSync } = require('child_process');
const { mkdirSync, readFileSync, writeFileSync } = require('fs');

function exec(cmd) {
    console.info(`> ${cmd}`);
    execSync(cmd);
}

try {
    const version = core.getInput('version');
    console.log(`Installing foundationdb ${version} (${os.platform()})!`);
    let base_url = `https://www.foundationdb.org/downloads/${version}`;
    switch (os.platform()) {
        case 'linux': {
            let client_url = `${base_url}/ubuntu/installers/foundationdb-clients_${version}-1_amd64.deb`;
            exec(`curl -O ${client_url}`);
            exec(`sudo dpkg -i foundationdb-clients_${version}-1_amd64.deb`);

            let server_url = `${base_url}/ubuntu/installers/foundationdb-server_${version}-1_amd64.deb`;
            exec(`curl -O ${server_url}`);
            exec(`sudo dpkg -i foundationdb-server_${version}-1_amd64.deb`);
            break;
        }
        case 'win32': {
            const cfg_path = "C:\\ProgramData\\foundationdb\\foundationdb.conf";
            let url = `${base_url}/windows/installers/foundationdb-${version}-x64.msi`;
            exec(`curl -O ${url}`);
            exec(`msiexec /i "foundationdb-${version}-x64.msi" /quiet /passive /norestart /log install.log`);
            exec(`net stop fdbmonitor`);
            mkdirSync("D:\\fdblogs");
            mkdirSync("D:\\fdbdata");
            let cfg = readFileSync(cfg_path, "utf8");
            cfg = cfg.replace(/logdir=.*/g, "logdir=D:\\fdblogs");
            cfg = cfg.replace(/datadir=.*/g, "datadir=D:\\fdbdata");
            writeFileSync(cfg_path, cfg, "utf8");
            console.log(cfg);
            exec(`net start fdbmonitor`);
            exec(`sleep 5`);
            exec(`"C:\\Program Files\\foundationdb\\bin\\fdbcli.exe" --exec 'status'`);
            exec(`"C:\\Program Files\\foundationdb\\bin\\fdbcli.exe" --exec 'configure new single ssd'`);
            exec(`sleep 5`);
            console.log("::add-path::C:\\Program Files\\foundationdb\\bin");
            break;
        }
        case 'darwin': {
            let url = `${base_url}/macOS/installers/FoundationDB-${version}.pkg`;
            exec(`curl -O ${url}`);
            exec(`sudo installer -pkg FoundationDB-${version}.pkg -target /`);
            break;
        }
    }

} catch (error) {
    core.setFailed(error.message);
}
