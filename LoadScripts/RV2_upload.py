#!/usr/bin/env python
'''Upload a RiboVision2 dataset to a MySQL database. Does not create tables, but checks whether input already exists and skips over it.'''
import re, os, sys, csv, glob, ntpath, getpass, argparse, mysql.connector
sys.stdout = os.fdopen(sys.stdout.fileno(), 'w', 0)

def create_and_parse_argument_options(argument_list):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('dataset_path', help='Path to dataset folder that contains CSVs for upload.', type=str)
    parser.add_argument('-host','--db_host', help='Defines database host (default: 130.207.36.75)', type=str, default='130.207.36.75')
    parser.add_argument('-schema','--db_schema', help='Defines schema to use (default: ribovision2)', type=str, default='ribovision2')
    parser.add_argument('-user_name','--uname', help='Defines user name to use (default: ppenev)', type=str, default='ppenev')
    parser.add_argument('-commit','--commit_changes', help='Commit the changes to the DB', action="store_true")
    parser.add_argument('-dataType','--data_set_type', help='Dataset type (default: ribosome)', type=str, default='ribosome')
    commandline_args = parser.parse_args(argument_list)
    return commandline_args

def read_csv(csv_path):
    with open(csv_path, 'r') as csv_file:
        reader = csv.reader(csv_file)
        csv_list = list(reader)
    return csv_list

def readCSVsInTables(listOfCSVPaths):
    '''Reads a list with locations of CSVs into named dictionary, defined by the last part of the csv file name.'''
    csvData = dict(Interactions = [['residue_i','residue_j','bp_type','bp_group','StructureName','ResNames','ResNums']],
                   StructuralData3 = [['map_Index','Value','VariableName','StructureName']])
    for f in listOfCSVPaths:
        tableName = ntpath.basename(f).replace('.csv','').split('_')[-1]
        if tableName == 'ProteinContacts':
            continue
        elif tableName == 'StructuralData3' or tableName == 'Interactions':
            csvData[tableName] = csvData[tableName] + read_csv(f)[1:]
        elif tableName == 'Conservation':
            conservation = read_csv(f)[1:]
            fixedPASEconservation = [[x.replace('PASE','CoVar_Entropy') for x in l] for l in conservation]
            csvData['StructuralData3'] = csvData['StructuralData3'] + fixedPASEconservation
        elif tableName == 'ProteinInteractions':
            protInteractions = read_csv(f)[1:]
            reorderedProtInteractions = [[row[0],row[1],row[2],row[3],row[6],row[4],row[5]] for row in protInteractions]
            csvData['Interactions'] = csvData['Interactions'] + reorderedProtInteractions
        else:
            csvData[tableName] = read_csv(f)
    return csvData


def checkParametersExistInTable(cursor, namedParameters, table):
    '''Checks the presence of named parameters in a table.
    The parameter names are used for the column names.
    Checks if the combination of all parameters exists in the table.'''

    query = "SELECT * FROM "+table+" WHERE "
    for dbColumn, colEntry in namedParameters.items():
        query += dbColumn+" = '"+colEntry+"' AND "
    query = re.sub(r' AND $', '', query)
    try:
        cursor.execute(query)
    except:
        return False
    
    result = cursor.fetchall()
    if len(result) > 0:
        return True
    else:
        return False

def uploadParametersInTable(cursor, namedParameters, table):
    '''Uploads a dict of named parameters in a table.
    The parameter names are used for the column names.'''

    query = "INSERT INTO `"+table+"`(`"
    values = " VALUES('"
    for dbColumn, colEntry in namedParameters.items():
        query += dbColumn+"`, `"
        values += colEntry+"', '"
    query = re.sub(r', `$', '', query)
    values = re.sub(r', \'$', '', values)
    query += ") "+values+")"

    print(query)
    cursor.execute(query)
    return True

def constructMasterTableAndSecondaryTertiary(ssDetailsTable, dataType, chainList, activeEntry = 1, defaultStruct = 1):
    '''Constructs a MasterTable entry from the SecondaryStructureDetails and ChainList Tables.
    Also constructs a list of entries for the Secondary_Tertiary table.
    Returns False when there is problem with parsing some of the data.\n
    The columns in the MasterTable are:\n
    Active, SpeciesName, DataSetType, StructureName, LoadString, Species_Abr\n
    The columns in the Secondary_Tertiary table are:\n
    DefaultStructure, SS_Table, StructureName'''

    speciesNames, speciesAbrs, ss_tables, pdbs = list(), list(), list(), list()
    masterTableEntry, secondaryTertiaryEntries = dict(), list()
    masterTableEntry['Active'] = str(activeEntry)

    for row in chainList[1:]:
        pdbs.append(row[0])
    if len(set(pdbs)) > 1:
        print("Multiple pdbs in ChainList are not supported!")
        return False
    
    for row in ssDetailsTable[1:]:
        speciesNames.append(row[0])
        speciesAbrs.append(row[1])
        ss_tables.append(row[2])
    if len(set(speciesNames)) > 1 or len(set(speciesAbrs)) > 1:
        print("Multiple species names or species abbreviations in SecondaryStructureDetails are not supported!")
        return False
    
    for ssTable in ss_tables:
        entryDict = dict(DefaultStructure = str(defaultStruct),
                         SS_Table = str(ssTable),
                         StructureName = str(pdbs[0]))
        secondaryTertiaryEntries.append(entryDict)

    masterTableEntry['SpeciesName'] = str(speciesNames[0])
    masterTableEntry['DataSetType'] = str(dataType)
    masterTableEntry['StructureName'] = str(pdbs[0])
    masterTableEntry['LoadString'] = '&'.join(ss_tables)
    masterTableEntry['Species_Abr'] = str(speciesAbrs[0])
    
    return masterTableEntry, secondaryTertiaryEntries

def constructStrucDataMenuEntries(strucData3, masterPDB, cursor):
    '''Generates list of StructuralDataMenu dictionaries in a list from StructuralData3.
    The column names are used as keys for the dictionaries.
    Checks whether StructuralData3 VariableNames exist in DataDescriptions and StructDataMenuDetails, stops execution if missing for now.'''
    allStructDataNames, pdbs, strucDataMenuEntries = list(), list(), list()
    #ADD NONE ENTRY FOR CLEARING DATA
    for row in strucData3[1:]:
        allStructDataNames.append(row[2])
        pdbs.append(row[3])
    
    if len(set(pdbs)) > 1:
        print("Multiple pdbs in StructuralData3 are not supported!")
        return False
    if str(pdbs[0]) != str(masterPDB):
        print("Detected difference between the StructuralData3 PDB: "+pdbs[0]+" and the MasterTable PDB: "+masterPDB+" !")
        return False

    for StructDataName in list(set(allStructDataNames)):
        if not checkParametersExistInTable(cursor, dict(ColName=StructDataName), 'DataDescriptions'):
            print("Add user input prompts and upload new entries in DataDescriptions")
            return False
        if not checkParametersExistInTable(cursor, dict(ColName=StructDataName), 'StructDataMenuDetails'):
            print("Add user input prompts and upload new entries in StructDataMenuDetails")
            return False
        
        query = "SELECT StructDataName FROM StructDataMenuDetails WHERE ColName = '"+StructDataName+"'"
        cursor.execute(query)
        result = cursor.fetchall()
        entryDict = dict(StructDataName = str(result[0][0]),
                     StructureName = str(pdbs[0]))
        strucDataMenuEntries.append(entryDict)
    
    return strucDataMenuEntries

def constructTableEntries(csvList):
    '''Given a csv list constructs a list of dictionaries with keys the names of the csv columns (first row).'''
    outputList = list()
    for row in csvList[1:]:
        rowDict = dict()
        for i, col in enumerate(csvList[0]):
            if i < len(row):
                rowDict[col] = row[i]
        outputList.append(rowDict)
    return outputList

def main(commandline_arguments):
    comm_args = create_and_parse_argument_options(commandline_arguments)
    pw = getpass.getpass("Password: ")
    cnx = mysql.connector.connect(user=comm_args.uname, password=pw, host=comm_args.db_host, database=comm_args.db_schema)
    cursor = cnx.cursor()
    if comm_args.dataset_path[-1] != '/':
        comm_args.dataset_path = comm_args.dataset_path+'/'
    filePaths = [f for f in glob.glob(comm_args.dataset_path+"*.csv")]

    csvData = readCSVsInTables(filePaths)

    masterTable, secondaryTertiaryEntries = constructMasterTableAndSecondaryTertiary(csvData["SecondaryStructureDetails"], comm_args.data_set_type, csvData["ChainList"])
    if (not masterTable):
        cursor.close()
        cnx.close()
        sys.exit("Failed parsing SecondaryStructureDetails!")

    if (not checkParametersExistInTable(cursor, masterTable, 'MasterTable')):
        uploadParametersInTable(cursor, masterTable, 'MasterTable')

    for secTertiary in secondaryTertiaryEntries:
        if (not checkParametersExistInTable(cursor, secTertiary, 'Secondary_Tertiary')):
            uploadParametersInTable(cursor, secTertiary, 'Secondary_Tertiary')

    strucDataMenuEntries = constructStrucDataMenuEntries(csvData["StructuralData3"], masterTable["StructureName"], cursor)
    if (not strucDataMenuEntries):
        cursor.close()
        cnx.close()
        sys.exit("Failed parsing StructuralData3!")

    for strucDataMenuEntry in strucDataMenuEntries:
        strucDataMenuEntryTemp = strucDataMenuEntry.copy()
        if 'CoVar_Entropy' == strucDataMenuEntry["StructDataName"]:
            strucDataMenuEntryTemp["StructDataName"] = 'PASE'
        if (not checkParametersExistInTable(cursor, strucDataMenuEntryTemp, 'StructDataMenu')):
            uploadParametersInTable(cursor, strucDataMenuEntryTemp, 'StructDataMenu')

    chainsEntries = constructTableEntries(csvData["ChainList"])
    for chainEntry in chainsEntries:
        if (not checkParametersExistInTable(cursor, dict(MoleculeName = chainEntry["MoleculeName"]), "MoleculeNames")):
            molGroup = raw_input("Missing molecule with name "+chainEntry["MoleculeName"]+".\nPlease input the molecule group (e.g. LSU): ")
            molType = raw_input("Please input the molecule type (e.g. rProtein): ")
            newMoleculeNameEntry = dict(MoleculeName = chainEntry["MoleculeName"],
                                        MoleculeGroup = str(molGroup),
                                        MoleculeType = str(molType))
            uploadParametersInTable(cursor, newMoleculeNameEntry, "MoleculeNames")

    for tableName in csvData.keys():
        print('Now processing data from the '+tableName+' table...')
        if tableName == 'ConservationTable':
            csvDataForCheck = [[col[0], col[7]] for col in csvData[tableName]]
        elif tableName == 'SecondaryStructureDetails':
            csvDataForCheck = [[col[0], col[1], col[2]] for col in csvData[tableName]]
        elif tableName == 'SecondaryStructures':
            csvDataForCheck = [[col[0], col[1], col[2], col[3], col[4], col[7]] for col in csvData[tableName]]
        elif tableName == 'StructuralData2':
            csvDataForCheck = [[col[0], col[-1]] for col in csvData[tableName]]
        elif tableName == 'StructuralData3':
            csvDataForCheck = [[col[0], col[2], col[3]] for col in csvData[tableName]]
        else:
            csvDataForCheck = csvData[tableName][:]
        tableEntriesForCheck = constructTableEntries(csvDataForCheck)
        tableEntries = constructTableEntries(csvData[tableName])
        for ix, rowEntryCheck in enumerate(tableEntriesForCheck):
            if (not checkParametersExistInTable(cursor, rowEntryCheck, tableName)):
                uploadParametersInTable(cursor, tableEntries[ix], tableName)

    if comm_args.commit_changes:
        cnx.commit()
    cursor.close()
    cnx.close()
    
    print("Don't forget to remove your password!")

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
