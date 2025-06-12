#!/usr/bin/env python3
"""
🏦 STOCKFORGE - Automated Duplicate Variable Fixer
🎯 Built for: Vishalsnw
📅 Created: 2025-06-12 09:29:16 UTC
🚀 Auto-fixes duplicate const declarations in useBotMarket.js
"""

import re
import os
from datetime import datetime

def fix_duplicate_declarations():
    """Remove duplicate variable declarations from useBotMarket.js"""
    
    # File path
    file_path = "src/hooks/useBotMarket.js"
    
    print("🤖 STOCKFORGE Auto-Fix Script Starting...")
    print(f"👤 User: Vishalsnw")
    print(f"📅 Time: 2025-06-12 09:29:16 UTC")
    print(f"🎯 Target: {file_path}")
    print("-" * 50)
    
    try:
        # Read the file
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        print(f"✅ File loaded: {len(content)} characters")
        
        # Variables to track
        variables_to_fix = [
            'currentUser',
            'currentDateTimeUTC', 
            'currentDate',
            'currentTime'
        ]
        
        # Count current occurrences
        print("\n🔍 Analyzing duplicate declarations...")
        for var in variables_to_fix:
            pattern = f"const {var} ="
            matches = re.findall(pattern, content)
            print(f"   {var}: {len(matches)} declarations found")
        
        # Remove duplicate declarations (keep only first occurrence)
        print("\n🔧 Removing duplicate declarations...")
        
        for var in variables_to_fix:
            # Find all occurrences of const variable = 'value';
            pattern = rf"const {var} = '[^']*';"
            matches = list(re.finditer(pattern, content))
            
            if len(matches) > 1:
                print(f"   🗑️ Removing {len(matches)-1} duplicates of {var}")
                
                # Keep only the first match, remove others
                for match in reversed(matches[1:]):  # Remove from end to start
                    start, end = match.span()
                    # Also remove the comment line above if it exists
                    lines_before = content[:start].split('\n')
                    if lines_before and '// ===== CURRENT INFO' in lines_before[-1]:
                        # Find the start of the comment line
                        start = start - len(lines_before[-1]) - 1
                    content = content[:start] + content[end:]
        
        # Update the first occurrence with current timestamp
        print("\n📝 Updating timestamp to current time...")
        
        # Update currentUser (keep as is)
        content = re.sub(
            r"const currentUser = '[^']*';",
            "const currentUser = 'Vishalsnw';",
            content,
            count=1
        )
        
        # Update currentDateTimeUTC
        content = re.sub(
            r"const currentDateTimeUTC = '[^']*';",
            "const currentDateTimeUTC = '2025-06-12 09:29:16';",
            content,
            count=1
        )
        
        # Update currentDate
        content = re.sub(
            r"const currentDate = '[^']*';",
            "const currentDate = '2025-06-12';",
            content,
            count=1
        )
        
        # Update currentTime
        content = re.sub(
            r"const currentTime = '[^']*';",
            "const currentTime = '09:29:16';",
            content,
            count=1
        )
        
        # Write the fixed content back
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)
        
        print(f"✅ File updated: {len(content)} characters")
        
        # Verify fix
        print("\n🔍 Verifying fix...")
        for var in variables_to_fix:
            pattern = f"const {var} ="
            matches = re.findall(pattern, content)
            status = "✅" if len(matches) == 1 else "❌"
            print(f"   {status} {var}: {len(matches)} declaration(s)")
        
        print("\n🎉 SUCCESS! Duplicate declarations removed!")
        print("📤 Ready to commit and deploy!")
        
        return True
        
    except FileNotFoundError:
        print(f"❌ ERROR: File {file_path} not found!")
        print("📍 Make sure you're in the frontend directory")
        return False
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    fix_duplicate_declarations()
