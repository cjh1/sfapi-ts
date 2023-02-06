import { file } from "@babel/types";
import {
  MethodDeclaration,
  MethodDeclarationStructure,
  OptionalKind,
  Project,
  ScriptTarget,
  SourceFile,
} from "ts-morph";

const typesToRename: Record<string, string> = {
  app__routers__compute__models__CommandOutput: "ComputeCommandOutput",
  app__routers__utils__models__CommandOutput: "CommandOutput",
  Body_create_group_account_groups_post: "CreateGroupBody",
  Body_run_command_utilities_command__machine__post: "RunCommandBody",
  Body_start_transfer_storage_transfer_post: "TransferStorageBody",
  Body_submit_job_compute_jobs__machine__post: "SubmitJobBody",
  Body_update_group_membership_account_groups__group__put: "UpdateGroupBody",
  Body_upload_file_utilities_upload__machine___path__put: "UploadFileBody",
  app__routers__status__models__Status: "Status",
};

const enumsToRename: Record<string, string> = {
  app__routers__compute__models__Status: "ComputeStatus",
  app__routers__storage__models__Status: "StorageStatus",
  app__routers__utils__models__Status: "UtilitiesStatus",
};

const methodsToRename: Record<string, Record<string, string>> = {
  AccountService: {
    readProjectsAccountProjectsGet: "getProjects",
    readUserAccountGet: "getUser",
    readRolesAccountRolesGet: "getRoles",
    readGroupsAccountGroupsGet: "getGroups",
    createGroupAccountGroupsPost: "createGroup",
    readGroupAccountGroupsGroupGet: "getGroup",
    updateGroupMembershipAccountGroupsGroupPut: "updateGroup",
  },
  ComputeService: {
    readJobsComputeJobsMachineGet: "getJobs",
    submitJobComputeJobsMachinePost: "submitJob",
    readJobComputeJobsMachineJobidGet: "getJob",
    cancelJobComputeJobsMachineJobidDelete: "cancelJob",
  },
  MetaService: {
    readChangelogMetaChangelogGet: "getChangelog",
    readConfigMetaConfigGet: "getConfig",
  },
  StorageService: {
    startTransferStorageTransferPost: "startTransfer",
  },
  TasksService: {
    readTaskTasksIdGet: "getTask",
    readTasksTasksGet: "getTasks",
  },
  UtilitiesService: {
    uploadFileUtilitiesUploadMachinePathPut: "uploadFile",
    downloadFileUtilitiesDownloadMachinePathGet: "downloadFile",
    readDirectoryUtilitiesLsMachinePathGet: "listDirectory",
    runCommandUtilitiesCommandMachinePost: "runCommand",
  },
  StatusService: {
    readStatusesStatusGet: "getStatus",
    readNotesStatusNotesGet: "getNotes",
    readOutagesStatusOutagesGet: "getOutages",
    readPlannedOutagesStatusOutagesPlannedGet: "getPlannedOutages",
    readNoteStatusNotesNameGet: "getNotesBySystem",
    readOutageStatusOutagesNameGet: "getOutagesBySystem",
    readPlannedOutagesStatusOutagesPlannedNameGet: "getPlannedOutagesBySystem",
    readStatusStatusNameGet: "getStatusBySystem",
  },
};

const renameTypes = (file: SourceFile) => {
  const name = file.getBaseNameWithoutExtension();
  if (Object.keys(typesToRename).indexOf(name) !== -1) {
    const newTypeName = typesToRename[name];
    const newFileName = `${newTypeName}.ts`;
    file.move(newFileName);
    // Rename the type
    const typeToRename = file.getTypeAlias(name);
    if (!typeToRename) {
      throw new Error(`Type not found: ${name}`);
    }
    typeToRename.rename(newTypeName);
  }
};

const renameEnums = (file: SourceFile) => {
  const name = file.getBaseNameWithoutExtension();
  if (Object.keys(enumsToRename).indexOf(name) !== -1) {
    const newTypeName = enumsToRename[name];
    const newFileName = `${newTypeName}.ts`;
    file.move(newFileName);
    // Rename the enum
    const enumToRename = file.getEnum(name);
    if (!enumToRename) {
      throw new Error(`Enum not found: ${name}`);
    }
    enumToRename.rename(newTypeName);
  }
};

const renameMethods = (file: SourceFile) => {
  const name = file.getBaseNameWithoutExtension();
  if (Object.keys(methodsToRename).indexOf(name) !== -1) {
    const renames = methodsToRename[name];
    const cls = file.getClass(name);

    if (!cls) {
      throw new Error(`Class not found: ${name}`);
    }

    Object.entries(renames).forEach(([oldName, newName]) => {
      const method = cls.getInstanceMethod(oldName);
      if (!method) {
        throw new Error(`Method not found: ${oldName}`);
      }

      method.rename(newName);
    });
  }

  file.getProject().save();
};

const refactorModels = async (project: Project) => {
  project.getSourceFiles().forEach((f: SourceFile) => {
    if (f.getDirectory().getBaseName() !== "models") return;

    renameTypes(f);
    renameEnums(f);
  });

  project.save();
};

const refactorServices = async (project: Project) => {
  project.getSourceFiles().forEach((f: SourceFile) => {
    if (f.getDirectory().getBaseName() !== "services") return;

    renameMethods(f);
  });
};

const refactor = async () => {
  const project = new Project({
    tsConfigFilePath: "./tsconfig.json",
  });
  project.addSourceFilesAtPaths(["src/sfapi/_internal/**/*.ts", "!**/*.d.ts"]);
  await refactorServices(project);
  await project.save();
  await refactorModels(project);
  await project.save();
};

refactor();
